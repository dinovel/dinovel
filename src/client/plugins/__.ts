import { Plugin } from 'dinovel/engine/mod.ts';
import { logger } from 'dinovel/std/logger.ts';

import { ClientEventsPlugin } from './client-events.ts';
import { ReloadEventsPlugin } from './reload-events.ts';

import { EventLoggerPlugin } from 'dinovel/engine/plugins/event-logger.ts';
import { EntityStorePlugin } from 'dinovel/modules/entity-module/plugin.ts';
import { RenderStorePlugin } from 'dinovel/modules/render-module/plugin.ts';
import { TempStorePlugin } from 'dinovel/modules/temp-store/plugin.ts';

export function getPlugins(useDefaults: boolean, userPlugins: Plugin[]): Plugin[] {
  const plugins = useDefaults ? [
    new ClientEventsPlugin(),
    new ReloadEventsPlugin(),
    new EventLoggerPlugin(),
    new EntityStorePlugin(),
    new RenderStorePlugin(),
    new TempStorePlugin(),
    ...userPlugins
  ] : userPlugins;

  const unique = new Map<string, Plugin>();

  for (const p of plugins) {
    if (unique.has(p.name)) {
      logger.warning(`Plugin ${p.name} will be overridden!`);
    }

    unique.set(p.name, p);
  }

  return [...unique.values()];
}
