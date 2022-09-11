import { createAction } from 'dinovel/std/state.ts';
import type { RenderState } from './state.ts';

export const renderActions = {
  addModule: createAction<{ priority: number, id: string } | string>('render:addModule'),
  removeModule: createAction<string>('render:removeModule'),
  forbidModules: createAction<string[]>('render:forbidModule'),
  unforbidModules: createAction<string[]>('render:unforbidModule'),
  render: createAction<Omit<RenderState, 'modules'>>('render:renderState'),
};
