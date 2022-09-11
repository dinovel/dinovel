import type { BaseEntity } from "./base.ts";
import type { Unit } from 'dinovel/std/helpers.ts';
import { entityActions } from './actions.ts';
import { createModule, on, StoreModules } from 'dinovel/std/state.ts';

export const ENTITY_STORE = '$$entities';

export type EntitiesState = {
  values: Unit;
}

export type EntityStore = {
  $$entities: EntitiesState;
}

const actions = entityActions<BaseEntity>();
export const entityStoreModule = createModule<EntitiesState>(
  { values: {} },
  on(actions.upsert, (s, a) => ({ values: upsert(s.values, a.payload) })),
  on(actions.remove, (s, a) => ({ values: { ...s.values, [a.payload]: undefined } })),
  on(actions.merge, (s, a) => ({ values: merge(s.values, a.payload) })),
  on(actions.set, (s, a) => ({ values: upsert(s.values, a.payload) })),
);

function upsert(state: { [key: string]: BaseEntity }, value: BaseEntity) {
  return {
    ...state,
    [value.id]: {
      ...(state[value.id] || {}),
      ...value,
    }
  }
}

function merge(state: { [key: string]: BaseEntity }, value: Partial<BaseEntity> & { id: string }) {
  return {
    ...state,
    [value.id]: {
      ...value,
      ...(state[value.id] || {}),
    }
  }
}

export const ENTITIES_MODULE: StoreModules<EntityStore> = {
  [ENTITY_STORE]: entityStoreModule
}
