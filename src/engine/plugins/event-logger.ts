import { logger } from 'dinovel/std/logger.ts';
import { DinovelCore } from "../core.ts";
import { Plugin } from '../plugin.ts';

export class EventLoggerPlugin implements Plugin {
  name = 'event-logger';

  inject?(core: DinovelCore): void {
    core.events.on('*').subscribe(ev => {
      const data = ev.hasData ? JSON.stringify(ev.data) : '{no data}';
      logger.debug(`[EVENT:${ev.type}] ${data}`);
    });
  }
}
