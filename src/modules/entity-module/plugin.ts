import type { DinovelCore, Plugin, Client } from 'dinovel/engine/mod.ts';
import { ENTITIES_MODULE } from './state.ts';

export class EntityStorePlugin implements Plugin {
  name = 'module:entity-store';
  inject(core: DinovelCore) {
    const engine = core.engine as Client;
    engine.store.merge(ENTITIES_MODULE);
  }
}
