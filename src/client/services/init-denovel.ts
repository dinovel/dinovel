// deno-lint-ignore-file no-explicit-any
import { registerGlobal, Dinovel } from 'dinovel/engine/dinovel.ts';
import { setDinovelInternals } from 'dinovel/engine/internal/__.ts';
import { dialogHandler } from 'dinovel/dialog/__.ts';

import { startServerEventListner } from './server-event-listner.ts';

// TODO: load config from endpoint
export function initDinovel() {
  setDinovelInternals({
    config: {
      app: '',
      mode: 'dev',
    } as any,
    version: {} as any,
  }, dialogHandler);
  registerGlobal();
  if (Dinovel.runtime.config.mode === 'dev') {
    startServerEventListner();
  }
}
