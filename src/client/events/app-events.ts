import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { AppEvents } from './models.ts';
import { setEventHandler } from './handlers/__.ts';

export const appEvents = Dinovel.events.add<AppEvents>();

setEventHandler(appEvents);
