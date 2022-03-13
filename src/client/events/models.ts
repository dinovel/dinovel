import { PublicEvents } from 'dinovel/server/shared/events.ts';

export interface ClientEvents {
  nav: string;
  ready: never;
}

export interface StoreEvents {
  /** refresh file list and resource collection */
  refreshResources: never;
  /** add new entry to app resources */
  addNewResourcegroup: never;
}

export type AppEvents = ClientEvents & StoreEvents & PublicEvents;
