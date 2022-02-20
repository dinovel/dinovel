import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { PublicEvents } from 'dinovel/server/shared/events.ts';

export interface ClientEvents {
  nav: string;
}

export const events = Dinovel.events
  .add<ClientEvents>()
  .add<PublicEvents>();
