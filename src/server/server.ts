import { Application, Router } from 'oak';
import type { InitServerOptions, UserStyle } from './server-options.ts';
import { Plugin, DinovelCore, initHandler, DinovelEvents, ServerStyles } from 'dinovel/engine/mod.ts';
import { EventsHandler } from "dinovel/std/events.ts";
import { logger } from 'dinovel/std/logger.ts';

import { ScriptWatcher } from './utils/script-watcher.ts';
import { getPlugins } from './plugins/__.ts';
import { SassWatcher } from "./utils/sass-watcher.ts";
import { readEnv } from './utils/env-reader.ts';

/**
 * Start a new server.
 *
 * @param opt options for the server
 * @param userPlugins plugins to load
 * @param defaults use default plugins
 */
export async function startDinovelServer(
  opt: InitServerOptions,
  userPlugins: Plugin[] = [],
  defaults = true
): Promise<void> {

  const plugins = getPlugins(defaults, userPlugins);
  const app = new Application();
  const router = new Router();
  const controler = new AbortController();
  const config = readEnv();
  let started = false;

  const core: DinovelCore = {
    events: new EventsHandler<DinovelEvents>(),
    engine: {
      type: 'server',
      version: '0.0.0',
      title: opt.title,
      app,
      router,
      scripts: new Map(),
      styles: initStyles(opt.style),
      get running() { return started; },
    }
  }

  const scriptWatcher = new ScriptWatcher(opt.inject, core);
  const sassWatcher = new SassWatcher(getStylePath(opt), core);
  const dinovelWatcher = new SassWatcher('../dinovel/styles/main.scss', core, 'dinovel');
  await scriptWatcher.start();
  sassWatcher.start();
  dinovelWatcher.start();

  // Only run watcher once
  if (config.mode !== 'dev') {
    scriptWatcher.stop();
    sassWatcher.stop();
    dinovelWatcher.stop();
  }

  logger.debug('Preloading plugins...');
  for (const plugin of plugins) {
    await plugin.inject?.call(plugin, core);
  }

  app.use(router.routes());
  app.use(router.allowedMethods());
  initHandler.init(core);

  logger.debug('Starting server...');
  const awaiter = app.listen({
    port: config.port,
    signal: controler.signal,
  });
  started = true;

  logger.debug('Starting plugins...');
  for (const plugin of plugins) {
    await plugin.start?.call(plugin, core);
  }

  setTimeout(() => {
    core.events.emit('started');
  }, 300);

  logger.info(`Server started at: http://localhost:${config.port}`);
  await awaiter;

  for (const plugin of plugins) {
    await plugin.stop?.call(plugin, core);
  }

  scriptWatcher.stop();
  sassWatcher.stop();
  dinovelWatcher.stop();
}

export function initStyles(opt: string | UserStyle): ServerStyles {
  const useDinovel = (typeof opt === 'string' ? true : opt.useDinovel) ?? true;
  return {
    dinovel: '',
    user: '',
    useDinovel
  }
}

export function getStylePath(opt: InitServerOptions): string {
  return typeof opt.style === 'string' ? opt.style : opt.style.path;
}
