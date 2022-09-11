import type { DinovelCore, Plugin } from 'dinovel/engine/mod.ts';
import { ENTITIES_MODULE } from './state.ts';

export class EntityStorePlugin implements Plugin {
  name = 'module:entity-store';
  inject(core: DinovelCore) {
    core.store.merge(ENTITIES_MODULE);
  }
}
