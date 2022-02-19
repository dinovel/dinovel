import { Dinovel } from 'dinovel/engine/dinovel.ts';

import { PublicEvents } from '../shared/events.ts';
import { ServerErrorEvent } from './server-error-event.ts';

export interface ServerEvents {
  serverError: ServerErrorEvent;
  serverStart: number;
  publicEvent: keyof PublicEvents;
  fileChanged: string[];
  processing: 'starting' | 'done';
  processError: [string, string | undefined];
  processSuccess: [string, string | undefined];
  watching: string[];
}

export const serverEvents = Dinovel.events.add<ServerEvents>();
