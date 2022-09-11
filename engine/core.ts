import type { Application, Router } from 'oak';
import type { Root } from 'react-dom/client'
import type { EventsHandler } from "dinovel/std/events.ts";
import type { Unit } from 'dinovel/std/helpers.ts';
import type { DinovelEvents } from './events.ts';
import { Store } from 'dinovel/std/state.ts';

export type Engine = Server | Client;
export type EngineType = 'server' | 'client' | 'cross';

export interface Server extends BaseEngine {
  readonly type: 'server';
  readonly app: Application;
  readonly router: Router;
  readonly styles: ServerStyles;
  readonly scripts: Map<string, string>;
}

export interface Client extends BaseEngine {
  readonly type: 'client';
  readonly app: Root;
}

export interface BaseEngine {
  readonly title: string;
  readonly version: string;
  readonly running: boolean;
}

export interface DinovelCore {
  readonly engine: Engine;
  readonly events: EventsHandler<DinovelEvents>;
  readonly store: Store<Unit>
}

export interface ServerStyles {
  user: string;
  dinovel: string;
  useDinovel: boolean;
}
