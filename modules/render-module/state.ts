import { createModule, on, StoreModules } from 'dinovel/std/state.ts';
import { insertAt, uniqueValues } from 'dinovel/std/helpers.ts';
import { renderActions } from './actions.ts';

export const RENDER_STORE = '$$render';

export const RENDER_LOADING_STATE = '$$renderLoading';

export type RenderState = {
  id: string;
  type: string;
  forbid: string[];
  modules: string[];
}

export type RenderStore = {
  $$render: RenderState;
}

export const renderStoreModule = createModule<RenderState>(
  {
    id: RENDER_LOADING_STATE,
    type: RENDER_LOADING_STATE,
    forbid: ['*'],
    modules: [],
  },
  on(renderActions.addModule, (s, a) => {
    const id = typeof a.payload === 'string' ? a.payload : a.payload.id;
    const priority = typeof a.payload === 'string' ? -1 : a.payload.priority;
    const modules = priority < 0 ? [...s.modules, id] : insertAt(s.modules, priority, id);

    return {
      ...s,
      modules: uniqueValues(modules),
    };
  }),
  on(renderActions.removeModule, (s, a) => ({
    ...s,
    modules: s.modules.filter(id => id !== a.payload),
  })),
  on(renderActions.forbidModules, (s, a) => ({
    ...s,
    forbid: uniqueValues([...s.forbid, ...a.payload]),
  })),
  on(renderActions.unforbidModules, (s, a) => ({
    ...s,
    forbid: s.forbid.filter(id => a.payload.find(id2 => id2 === id) === undefined),
  })),
  on(renderActions.render, (s, a) => ({
    ...s,
    id: a.payload.id,
    type: a.payload.type,
    forbid: a.payload.forbid,
  })),
);

export const RENDER_MODULE: StoreModules<RenderStore> = {
  [RENDER_STORE]: renderStoreModule,
}
