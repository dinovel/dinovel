import { logger } from 'dinovel/std/logger.ts';
import { ESBundler } from "dinovel/bundlers/esbuild.ts";
import { buildURL } from "dinovel/std/path.ts";
import { parse } from 'deno/path/mod.ts';

import type { DinovelCore, ScriptSrc, Server } from 'dinovel/engine/mod.ts';

import { Watcher } from './watcher.ts';

export class ScriptWatcher {
  #script: URL[];
  #watcher: Watcher;
  #core: DinovelCore;
  #bundler: ESBundler;

  public constructor(scripts: URL[], core: DinovelCore) {
    this.#script = scripts;
    this.#core = core;

    const dirList = scripts.map(e => parse(e.pathname).dir);
    this.#watcher = new Watcher({
      extensions: ['js', 'ts', 'jsx', 'tsx'],
      paths: dirList,
      action: () => this.triggerBundler(),
    });

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
    });
  }

  public async start() {
    await this.bundle();
    this.#watcher.start();
  }

  public stop() {
    this.#watcher.stop();
  }

  private async triggerBundler() {
    logger.info('Changes detected, compiling scripts...');
    try {
      await this.bundle();
      this.#core.events.emit('reload', 'script');
      logger.info('Compilation finished. Reloading...');
    } catch (err) {
      logger.error('Error compiling scripts:', err);
    }
  }

  private async bundle() {
    const results: ScriptSrc[] = [];

    for (const path of this.#script) {
      const name = parse(path.pathname).name;
      logger.debug(`Compiling ${name}...`);
      const res = await this.#bundler.bundle(path);

      if (res.warnings.length) {
        logger.warning(`Warnings for ${name}:`);
        for (const warning of res.warnings) {
          logger.warning('[ESBundle]', warning);
        }
      }

      if (res.errors.length) {
        for (const error of res.errors) {
          logger.error('[ESBundle]', error);
        }
        throw new Error(`Error compiling ${name}`);
      }

      if (!res.outputFiles) {
        throw new Error(`No output files for ${name}`);
      }

      const src = res.outputFiles[0].text;
      results.push({ name, src });
    }

    (this.#core.engine as Server).scripts = results;
    logger.debug('Scripts compiled.');
  }
}
