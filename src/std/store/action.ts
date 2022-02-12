import type { Action, ActionPayload, ActionAnyCreator } from './models.ts';

export function createAction(type: string): () => Action;
export function createAction(type: symbol): () => Action;
export function createAction<T>(type: string): (payload: T) => ActionPayload<T>;
export function createAction<T>(type: symbol): (payload: T) => ActionPayload<T>;
export function createAction(type: string | symbol): ActionAnyCreator<unknown> {
  return (payload?: unknown) => {
    return payload === undefined ? { type } : { type, payload };
  };
}
