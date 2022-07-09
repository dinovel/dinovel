// deno-lint-ignore-file no-explicit-any
import { StoreModules, StoreState } from "./models.ts";
import { Store } from "./store.ts";

export const GLOBAL_STORE_KEY = Symbol.for('__DINOVEL_STORE__');

/** Check if store match moduleList */
export function isStore<T extends StoreState>(store: Store<any>, mods: StoreModules<T>): store is Store<T> {
  const expectedNames = Object.keys(mods);
  const actualNames = store.modulesName;

  for (const name of expectedNames) {
    if (!actualNames.includes(name)) return false;
  }

  return true;
}

/** load global store */
export function globalStore<T extends StoreState>(): Store<T> {
  const store = (window as any)[GLOBAL_STORE_KEY] as Store<T>;
  if (!store) throw new Error('Global store does not exist');
  return store;
}

/** Global store exists */
export function hasGlobalStore(): boolean {
  return typeof (window as any)[GLOBAL_STORE_KEY] === 'object'
    && (window as any)[GLOBAL_STORE_KEY] !== null;
}

/** Create store if needed, and returns it  */
export function ensureGlobalStore<T extends StoreState>(mods: StoreModules<T>): Store<T> {
  if (!hasGlobalStore()) {
    const store = new Store(mods);
    (window as any)[GLOBAL_STORE_KEY] = store;
    return store;
  }

  let store = globalStore<any>();
  if (!isStore(store, mods)) {
    store = store.merge(mods);
    (window as any)[GLOBAL_STORE_KEY] = store;
  }
  return store;
}
