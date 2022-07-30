import { logger } from 'dinovel/std/logger.ts';
import { DenoBundle, DenoBundler, bundle } from "dinovel/bundlers/deno.ts";
import { buildURL } from "dinovel/std/path.ts";
import { parse } from 'deno/path/mod.ts';

import type { DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class DenoScriptWatcher {
  #script: URL[];
  #core: DinovelCore;
  #bundlers = new Set<DenoBundler>();
  #status = new Map<URL, boolean>();

  public constructor(scripts: URL[], core: DinovelCore) {
    this.#script = scripts;
    this.#core = core;
  }

  public async start() { await this.bundle(); }

  public stop() {
    this.#bundlers.forEach(b => b.kill());
  }

  private async bundle() {
    for (const path of this.#script) {
      const bundler = bundle({
        entry: path,
        denoConfig: './deno.jsonc',
        importMap: buildURL('./import_map.json'),
        unstable: true,
        watch: true,
        forceReload: true,
      }, res => this.onSuccess(res, path), logger);
      bundler.status().then(code => {
        if (code !== 0) {
          logger.error(`Deno bundler error [${code}]: ${path.href}`);
        }
      })

      while (!this.#status.has(path)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.#bundlers.add(bundler);
    }
  }

  private onSuccess(res: DenoBundle, src: URL): void {
    this.#status.set(src, true);

    if (!res.success) {
      logger.error(`Deno bundler error for: ${src}`);
      logger.error(res.message);
      return;
    }

    for (const warn of res.warns ?? []) {
      logger.warning(warn);
    }

    logger.debug(`Deno bundler success for: ${src}`);
    const name = parse(src.href).name;

    (this.#core.engine as Server).scripts.set(name, res.bundle);
    this.#core.events.emit('reload', 'script');
  }
}
