import type { DinovelCore } from 'dinovel/engine/mod.ts';
import { Observable, map, distinctUntilChanged } from 'rxjs';

import { RenderStore, RENDER_STORE } from './state.ts';

export function hasModule(src: string[], value: string): boolean {
  return src[0] === '*' ||
    src.find(id => id === value) !== undefined;
}

export function shouldRenderModule(core: DinovelCore, id: string): Observable<boolean> {
  return core.store.alias<RenderStore>()
    .state(RENDER_STORE)
    .pipe(
      map(s => hasModule(s.modules, id) && !hasModule(s.forbid, id)),
      distinctUntilChanged(),
    );
}
