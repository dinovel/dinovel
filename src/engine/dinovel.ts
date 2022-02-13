import { EventsHandler } from 'dinovel/std/core/events.ts';
import { LoggerService } from 'dinovel/std/logger.ts';
import { DinovelCompilers } from "../compiler/compiler.ts";

import { EngineEvents } from './events.ts';
import { getRuntime } from './internal/runtime.ts';

/** Global reference to Dinovel engine */
export const Dinovel = {
  /** App logger */
  logger: new LoggerService(),
  /** Dinovel runtime */
  get runtime() { return getRuntime(); },
  /** Events handler */
  events: new EventsHandler<EngineEvents>(),
  /** Compilers */
  compilers: new DinovelCompilers(),
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
