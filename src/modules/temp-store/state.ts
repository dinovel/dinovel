import { Unit } from "dinovel/std/helpers.ts";
import { createModule, on, StoreModules, createAction } from "dinovel/std/state.ts";

export const TEMP_STORE = '$$temp';

export const tempStoreActions = {
  set: createAction<Record<string, unknown>>('temp:set'),
  clear: createAction('temp:clear'),
}

export type TempStore = {
  $$temp: Unit;
}

export const tempStoreModule = createModule<Unit>({},
  on(tempStoreActions.set, (s, a) => ({ ...s, ...a.payload })),
  on(tempStoreActions.clear, () => ({})),
);

export const TEMP_MODULE: StoreModules<TempStore> = {
  [TEMP_STORE]: tempStoreModule,
}
