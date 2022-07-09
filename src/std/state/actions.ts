import { ActionBuilderNoPayload, ActionBuilderWithPayload, ActionBuilder } from './models.ts';

/** Create a new action */
export function createAction(type: string): ActionBuilderNoPayload;
/** Create a new action */
export function createAction(type: symbol): ActionBuilderNoPayload;
/** Create a new action with a payload */
export function createAction<T>(type: string): ActionBuilderWithPayload<T>;
/** Create a new action with a payload */
export function createAction<T>(type: symbol): ActionBuilderWithPayload<T>;
export function createAction(type: string | symbol): ActionBuilder<unknown> {
  return (payload?: unknown) => {
    return payload === undefined ? { type } : { type, payload };
  };
}
