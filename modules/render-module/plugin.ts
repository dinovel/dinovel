import type { DinovelCore, Plugin } from 'dinovel/engine/mod.ts';
import { RENDER_MODULE } from './state.ts';

export class RenderStorePlugin implements Plugin {
  name = 'module:render-store';
  inject(core: DinovelCore) {
    core.store.merge(RENDER_MODULE);
  }
}
