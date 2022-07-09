import { Application, Router } from 'oak';
import type { InitServerOptions } from './server-options.ts';
import { Plugin, DinovelCore, initHandler, DinovelEvents, ScriptSrc } from 'dinovel/engine/mod.ts';
import { EventsHandler } from "dinovel/std/events.ts";
import { ESBundler, SassBundler } from 'dinovel/bundlers/mod.ts';
import { buildURL } from 'dinovel/std/path.ts';
import { parse } from 'deno/path/mod.ts';
import { logger } from 'dinovel/std/logger.ts';

import { getPlugins } from './plugins/__.ts';

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
  let started = false;

  logger.info('Compiling sources...');
  const scripts = await bundleScritps(opt.inject);
  const style = bundleStyles(opt.style);

  const core: DinovelCore = {
    events: new EventsHandler<DinovelEvents>(),
    engine: {
      type: 'server',
      version: '0.0.0',
      title: opt.title,
      app,
      router,
      scripts,
      get running() { return started; },
      style,
    }
  }

  logger.info('Preloading plugins...');
  for (const plugin of plugins) {
    await plugin.inject?.call(plugin, core);
  }

  app.use(router.routes());
  app.use(router.allowedMethods());
  initHandler.init(core);

  logger.info('Starting server...');
  const awaiter = app.listen({
    port: 8666,
    signal: controler.signal,
  });
  started = true;

  logger.info('Starting plugins...');
  for (const plugin of plugins) {
    await plugin.start?.call(plugin, core);
  }

  logger.info('Server started at: http://localhost:8666');
  await awaiter;

  for (const plugin of plugins) {
    await plugin.stop?.call(plugin, core);
  }

}

async function bundleScritps(paths: URL[]): Promise<ScriptSrc[]> {
  const results: ScriptSrc[] = [];

  const bundler = new ESBundler({
    banner: '// INJECTED',
    drop: [],
    incremental: true,
    keepNames: false,
    logLevel: 'verbose',
    logLimit: 15,
    minify: false,
    root: '',
    treeShaking: true,
    importMapURL: buildURL('./import_map.json'),
  });

  logger.info('Compiling client scripts...');
  for (const path of paths) {
    const name = parse(path.pathname).name;
    logger.info(`Compiling ${name}...`);
    const res = await bundler.bundle(path);

    if (res.warnings.length) {
      logger.warning(`Warnings for ${name}:`);
      for (const warning of res.warnings) {
        logger.warning('[ESLint]', warning);
      }
    }

    if (res.errors.length) {
      for (const error of res.errors) {
        logger.error('[ESLint]', error);
      }
      throw new Error(`Error compiling ${name}`);
    }

    if (!res.outputFiles) {
      throw new Error(`No output files for ${name}`);
    }

    const src = res.outputFiles[0].text;
    results.push({ name, src });
  }
  logger.info('Client scripts compiled.');

  return results;
}

function bundleStyles(url: URL): string {
  logger.info('Compiling styles...');
  const bundler = new SassBundler({
    quiet: false,
    style: 'expanded',
  });

  const fullName = url.pathname;

  const style = bundler.bundle(fullName).to_string();

  if (!style) {
    throw new Error(`No style for ${fullName}`);
  }

  if (typeof style === 'string') {
    return style;
  }

  for (const p of style.entries()) {
    return p[1];
  }

  throw new Error(`No style for ${fullName}`);
}
