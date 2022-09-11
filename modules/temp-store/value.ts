// deno-lint-ignore-file no-explicit-any
import { initHandler } from 'dinovel/engine/mod.ts';
import { StoreValue } from 'dinovel/std/state.ts';
import { deepEqual, JSONObject } from 'dinovel/std/helpers.ts';
import { map, distinctUntilChanged } from 'rxjs';

import { TempStore, TEMP_STORE, tempStoreActions } from './state.ts';

export function getTempValue<T>(key: string): StoreValue<T> {
  const store = initHandler.core.store.alias<TempStore>();
  const tempStore = store.module(TEMP_STORE);
  const obsValue = tempStore.state.pipe(
    map(s => (s as any)[key]),
    distinctUntilChanged(),
  );

  return new StoreValue(
    () => (tempStore.currentState as any)[key] as T,
    (value: T) => store.dispatch(tempStoreActions.set({ key, value })),
    obsValue,
  );
}

export function getTempValues<T extends JSONObject>(...keys: (keyof T)[]): StoreValue<T> {
  const store = initHandler.core.store.alias<TempStore>();
  const tempStore = store.module(TEMP_STORE);

  function getValue(obj: any): T {
    const result: any = {};
    for (const key of keys) {
      result[key] = obj[key];
    }
    return result;
  }
  const obsValue = tempStore.state.pipe(
    map(s => getValue((s || {}) as any)),
    distinctUntilChanged((a, b) => deepEqual(a, b)),
  );

  return new StoreValue(
    () => getValue(tempStore.currentState),
    (value: T) => store.dispatch(tempStoreActions.set(value)),
    obsValue,
  );
}
