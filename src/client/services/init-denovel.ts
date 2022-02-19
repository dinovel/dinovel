// deno-lint-ignore-file no-explicit-any
import { registerGlobal, Dinovel } from 'dinovel/engine/dinovel.ts';
import { setRuntime } from 'dinovel/engine/internal/runtime.ts';

import { startEventhandler } from './event-handler.ts';
import { startServerEventListner } from './server-event-listner.ts';

// TODO: load config from endpoint
export function initDinovel() {
  setRuntime({
    config: {
      app: '',
      mode: 'dev',
    } as any,
    version: {} as any,
  })
  registerGlobal();
  if (Dinovel.runtime.config.mode === 'dev') {
    startEventhandler();
    startServerEventListner();
  }
}
