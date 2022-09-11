import type { DinovelCore, Plugin } from 'dinovel/engine/mod.ts';
import { TEMP_MODULE } from './state.ts';

export class TempStorePlugin implements Plugin {
  name = 'module:temp-store';
  inject(core: DinovelCore) {
    core.store.merge(TEMP_MODULE);
  }
}
