import { LoggerService } from '../logger/logger.ts';
import {
  IObservable,
  ISubscription,
  IValueObservable,
} from '../reactive/models.ts';
import { select } from '../reactive/pipes.ts';
import { deepEqual } from './utils.ts';

import type {
Action,
  StoreState,
  StoreStateMap,
} from './models.ts';
export const GLOBAL_STORE_KEY = Symbol.for('__DINOVEL_STORE__');

/** State handler */
export class Store<T extends StoreState> {

  private readonly _reducerMap: StoreStateMap<T>;
  private _logger = new LoggerService();

  public constructor(reducerMap: StoreStateMap<T>) {
    this._reducerMap = reducerMap;
  }

  public merge<U extends StoreState>(reducerMap: StoreStateMap<U>): Store<T & U> {
    for (const key in reducerMap) {
      if (this._reducerMap[key]) { continue; }
      this._reducerMap[key] = reducerMap[key] as unknown as StoreStateMap<T>[typeof key];
    }
    return this as unknown as Store<T & U>;
  }

  public select<K extends keyof T, U>(key: K, map: (s: T[K]) => U): IObservable<U>;
  public select<K extends keyof T>(key: K): IValueObservable<T[K]>;
  public select<K extends keyof T>(key: K, subs?: (s: T[K]) => unknown): IValueObservable<unknown> | IObservable<unknown> {
    if (!subs) return this._reducerMap[key].state;
    else return this._reducerMap[key].state.pipe(
      select(subs, deepEqual as unknown as (a: unknown, b: unknown) => boolean));
  }

  public subscribe<K extends keyof T>(key: K, observer: (state: T[K]) => unknown): ISubscription {
    return this.select(key).subscribe({ next: observer });
  }

  public reset<K extends keyof T>(key: K, newState: T[K]): void {
    this._reducerMap[key].resetState(newState);
  }

  public dispatch(action: Action): Promise<void> {
    return new Promise((resolve) => {
      for (const key in this._reducerMap) {
        try {
          this._reducerMap[key].apply(action);
        } catch (err) {
          this._logger.error(`Error in reducer ${key}: ${err.message}`, err);
        }
      }
      resolve();
    });
  }


  /**
   * If store is not initialized, initialize it with the given state.
   * If store is already initialized, merge the given state with the existing one.
   *
   * @param reducerMap reducers to add to global store
   * @returns the global store
   */
  public static initGlobal<T extends StoreState>(reducerMap: StoreStateMap<T>): Store<T> {
    let store = (globalThis as unknown as Record<symbol, Store<T>>)[GLOBAL_STORE_KEY];
    if (!store) {
      store = new Store(reducerMap);
      (globalThis as unknown as Record<symbol, Store<T>>)[GLOBAL_STORE_KEY] = store;
    } else {
      store.merge(reducerMap);
    }

    return store;
  }

  /**
   * Return the global store, if it is initialized.
   *
   * @returns the global store
   */
  public static global<T extends StoreState>(): Store<T> {
    const store = (globalThis as unknown as Record<symbol, Store<T>>)[GLOBAL_STORE_KEY];
    if (!store) { throw new Error('Store is not initialized'); }
    return store;
  }

}
