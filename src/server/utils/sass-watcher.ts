import { logger } from 'dinovel/std/logger.ts';
import { buildURL } from 'dinovel/std/path.ts';
import { SassBundler } from "dinovel/bundlers/sass.ts";
import { parse } from 'deno/path/mod.ts';

import type { DinovelCore, Server } from 'dinovel/engine/mod.ts';

import { Watcher } from './watcher.ts';

export class SassWatcher {
  #path: string;
  #watcher: Watcher;
  #core: DinovelCore;

  public constructor(path: string, core: DinovelCore) {
    this.#path = path;
    this.#core = core;

    const fullPath = buildURL(path);
    const dir = parse(fullPath.pathname).dir;

    this.#watcher = new Watcher({
      extensions: ['scss'],
      paths: [dir],
      action: () => this.triggerBundler(),
    });
  }

  public start() {
    this.bundle();
    this.#watcher.start();
  }

  public stop() {
    this.#watcher.stop();
  }

  private triggerBundler() {
    logger.info('Changes detected, compiling styles...');
    try {
      this.bundle();
      this.#core.events.emit('reload', 'style');
      logger.info('Compilation finished. Reloading styles...');
    } catch (err) {
      logger.error('Error compiling styles:', err);
    }
  }

  private bundle() {
    logger.debug('Bundling styles...');
    const bundler = new SassBundler({
      quiet: false,
      style: 'expanded',
    });

    const style = bundler.bundle(this.#path).to_string();

    if (!style) {
      throw new Error(`No style for ${this.#path}`);
    }

    if (typeof style === 'string') {
      (this.#core.engine as Server).style = style;
    } else if (style instanceof Map) {
      for (const p of style.entries()) {
        (this.#core.engine as Server).style = p[1];
      }
    } else {
      throw new Error(`No style for ${this.#path}`);
    }

    logger.debug('Styles compiled.');
  }

}
