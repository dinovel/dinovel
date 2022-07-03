import type { Application, Router } from 'oak';
import type { EventsHandler } from "../std/events.ts";
import type { DinovelEvents } from './events.ts';

export type Engine = Server | Client;
export type EngineType = 'server' | 'client' | 'cross';

export interface ScriptSrc {
  src: string;
  name: string;
}

export interface Server extends BaseEngine {
  readonly type: 'server';
  readonly app: Application;
  readonly router: Router;
  scripts: ScriptSrc[];
  style: string;
}

export interface Client extends BaseEngine {
  readonly type: 'client';
}

export interface BaseEngine {
  readonly title: string;
  readonly version: string;
  readonly running: boolean;
}

export interface DinovelCore {
  readonly engine: Engine;
  readonly events: EventsHandler<DinovelEvents>;
}
