// deno-lint-ignore-file no-explicit-any
import type { IValueObservable, IObservable } from "dinovel/std/reactive/__.ts";
import type { Ref, UnwrapRef, ComputedRef } from './vue-models.ts';
import { ref, computed } from 'vue';
import { Action, StoreState } from "dinovel/std/store/models.ts";
import type { Store } from "dinovel/std/store/store.ts";

/** Observable reference for composition api */
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, initialValue: K, map: (e: T) => K): Ref<K>;
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, map: (e: T) => K): Ref<K>;
export function obs<T>(observable: IValueObservable<T> | IObservable<T>, initialValue: T): Ref<T>;
export function obs<T>(observable: IValueObservable<T> | IObservable<T>): Ref<T>;
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, initValue?: T | ((e?: T) => K), mapValue?: (e?: T) => K): Ref<any> {
  const initialValue = typeof initValue === 'function' ? undefined : initValue;
  const mapFn = typeof initValue === 'function' ? initValue as ((e?: T) => K): mapValue;
  const map = (e?: T) => mapFn ? mapFn(e) : e;
  const obsValue = (observable as IValueObservable<T>).value ?? initialValue;
  const value: Ref<UnwrapRef<any>> = ref(map(obsValue));

  observable.subscribe({
    next: e => {
      value.value = map(e) as UnwrapRef<T>;
    }
  })

  return value;
}

/**
 * Created a computed reference for composition api
 * that will be updated when the store state value changes
 * and updates the store state value when the computed value changes
 *
 * @param store State store
 * @param key State key
 * @param action Action to dispatch
 */
export function computedStore<
  T extends StoreState,
  K extends Extract<keyof T, string>,
  V extends T[K]
>(store: Store<T>, key: K, action: (value: V) => Action): ComputedRef<V>
/**
 * Created a computed reference for composition api
 * that will be updated when the store state value changes
 * and updates the store state value when the computed value changes
 *
 * @param store State store
 * @param key State key
 * @param action Action to dispatch
 * @param map Map function to transform the state value
 */
export function computedStore<
  T extends StoreState,
  K extends Extract<keyof T, string>,
  V extends T[K],
  R
>(store: Store<T>, key: K, action: (value: R) => Action, map: (value: V) => R): ComputedRef<R>
export function computedStore<
  T extends StoreState,
  K extends Extract<keyof T, string>,
  V extends T[K],
  R
>(store: Store<T>, key: K, action: (value: R) => Action, map?: (value: V) => R): ComputedRef<R> | ComputedRef<V>{
  const _ref = obs(store.select(key));
  const _map = map ?? ((e: V) => e as unknown as R);
  return computed({
    get() { return _map(_ref.value as unknown as V); },
    set(value: R) { store.dispatch(action(value)); }
  }) as unknown as ComputedRef<R>;
}
