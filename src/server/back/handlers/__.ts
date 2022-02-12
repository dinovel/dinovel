import { serverEvents } from '../infra/events.ts';
import { ServerOptions } from '../models/server-options.ts';
import { fileChanged } from './file-change.handler.ts';

export function registerHandlers(opt: ServerOptions): void {
  serverEvents.on('fileChanged', (paths: string[]) => {
    fileChanged(opt, paths);
  });
}
