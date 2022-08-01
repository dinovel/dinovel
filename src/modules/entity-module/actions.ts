import type { BaseEntity } from "./base.ts";
import { createAction, ActionBuilderWithPayload } from 'dinovel/std/state.ts';

export interface IBaseActions<T> {
  /** Add or update entity */
  upsert: ActionBuilderWithPayload<T>;
  /** Remove entity */
  remove: ActionBuilderWithPayload<string>;
  /** Add only missing properties */
  merge: ActionBuilderWithPayload<T>;
  /** Replace defined properties */
  set: ActionBuilderWithPayload<Partial<T> & { id: string }>;
}

const BASE_ACTIONS: IBaseActions<BaseEntity> = {
  upsert: createAction<BaseEntity>('entity:upsert'),
  remove: createAction<string>('entity:remove'),
  merge: createAction<BaseEntity>('entity:merge'),
  set: createAction<Partial<BaseEntity> & { id: string }>('entity:set'),
}

export function entityActions<T extends BaseEntity>(): IBaseActions<T> {
  return BASE_ACTIONS as unknown as IBaseActions<T>;
}
