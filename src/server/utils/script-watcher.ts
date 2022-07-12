import { logger } from 'dinovel/std/logger.ts';
import { ESBundler, BuildResult, BuildFailure, OutputFile } from "dinovel/bundlers/esbuild.ts";
import { buildURL } from "dinovel/std/path.ts";
import { parse } from 'deno/path/mod.ts';

import type { DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class ScriptWatcher {
  #script: URL[];
  #core: DinovelCore;
  #bundler: ESBundler;
  #res = new Set<BuildResult>();

  public constructor(scripts: URL[], core: DinovelCore) {
    this.#script = scripts;
    this.#core = core;

    this.#bundler = new ESBundler({
      banner: '// INJECT',
      drop: [],
      incremental: true,
      keepNames: false,
      logLevel: 'warning',
      logLimit: 15,
      minify: false,
      root: '',
      treeShaking: true,
      importMapURL: buildURL('./import_map.json'),
      watch: {
        onRebuild: (err, res) => {
          if (err) {
            this.onError(err, res?.outputFiles);
          } else if (res) {
            this.onSuccess(res);
          }
        }
      }
    });
  }

  public async start() {
    await this.bundle();
  }

  public stop() {
    this.#res.forEach(r => r.stop?.call(r));
  }

  private async bundle() {
    for (const path of this.#script) {
      const res = await this.#bundler.bundle(path);
      this.onSuccess(res, false);
    }

    logger.debug('Scripts compiled.');
  }

  private onError(res: BuildFailure, out: OutputFile[] | undefined): void {
    const file = (out && out[0]) ?? undefined;

    if (file) {
      logger.error(`Error compiling ${file.path}`);
    }

    if (res.warnings.length) {
      for (const warning of res.warnings) {
        logger.warning('[ESBundle]', warning);
      }
    }

    if (res.errors.length) {
      for (const error of res.errors) {
        logger.error('[ESBundle]', error);
      }
      return;
    }
  }

  private onSuccess(res: BuildResult, reload = true): void {
    const file = res.outputFiles![0];
    const name = parse(file.path).name;
    logger.debug(`Compiled ${name}`);

    if (res.warnings.length) {
      for (const warning of res.warnings) {
        logger.warning('[ESBundle]', warning);
      }
    }

    if (res.errors.length) {
      for (const error of res.errors) {
        logger.error('[ESBundle]', error);
      }
      return;
    }

    (this.#core.engine as Server).scripts.set(name, file.text);
    if (reload) { this.#core.events.emit('reload', 'script'); }
  }
}
