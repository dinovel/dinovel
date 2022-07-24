import { Plugin } from 'dinovel/engine/mod.ts';
import { logger } from 'dinovel/std/logger.ts';

import { ServeAssetsByIdPlugin } from 'dinovel/modules/assets-module/plugin.ts';

import { ServeAssetsPlugin } from './serve-assets.ts';
import { ServeStylePlugin } from './serve-style.ts';
import { ServerEventsPlugin } from './server-events.ts';
import { ServeScriptsPlugin } from './serve-scripts.ts';
import { ServeHomePlugin } from './serve-home.ts';

import { EventLoggerPlugin } from 'dinovel/engine/plugins/event-logger.ts';

export function getPlugins(useDefaults: boolean, userPlugins: Plugin[]): Plugin[] {
  const plugins = useDefaults ? [
    new ServeHomePlugin(),
    new ServerEventsPlugin(),
    new ServeStylePlugin(),
    new ServeScriptsPlugin(),
    new ServeAssetsPlugin(),
    new EventLoggerPlugin(),
    new ServeAssetsByIdPlugin(),
    ...userPlugins
  ] : userPlugins;

  const unique = new Map<string, Plugin>();

  for (const p of plugins) {
    if (unique.has(p.name)) {
      logger.warning(`Plugin ${p.name} was overridden by user plugin.`);
    }

    unique.set(p.name, p);
  }

  return [...unique.values()];
}
