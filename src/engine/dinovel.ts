import { EventsHandler } from 'dinovel/std/core/events.ts';
import { LoggerService } from 'dinovel/std/logger.ts';
import { valueMapStore } from 'dinovel/std/value-map/value-map-store.ts';
import { DinovelCompilers } from "dinovel/compiler/compiler.ts";

import { EngineEvents } from './events.ts';
import { getRuntime, getDialogHandler } from './internal/init.ts';
import { dinovelStore } from "./store.ts";

/** Global reference to Dinovel engine */
export const Dinovel = {
  /** App logger */
  logger: new LoggerService(),
  /** Dinovel runtime */
  get runtime() { return getRuntime(); },
  /** Dinovel dialog handler */
  get dialogs() { return getDialogHandler(); },
  /** Events handler */
  events: new EventsHandler<EngineEvents>(),
  /** Compilers */
  compilers: new DinovelCompilers(),
  /** Store */
  store: dinovelStore,
  /** Value map store */
  valuesMap: valueMapStore,
};

export function registerGlobal() {
  if (typeof window !== 'undefined') {
    // deno-lint-ignore no-explicit-any
    (window as any).Dinovel = Dinovel;
  }
}

export function useDinovel(): typeof Dinovel {
  if (typeof window !== 'undefined') {
    // deno-lint-ignore no-explicit-any
    return (window as any).Dinovel;
  }

  throw new Error('Dinovel is not available in this environment');
}
