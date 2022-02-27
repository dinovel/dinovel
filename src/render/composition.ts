// deno-lint-ignore-file no-explicit-any
import type { IValueObservable, IObservable } from "dinovel/std/reactive/__.ts";
import type { Ref, UnwrapRef } from './vue-models.ts';
import { ref } from 'vue';

/** Observable reference for composition api */
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, initialValue: T, map: (e: T) => K): Ref<UnwrapRef<K>>;
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, map: (e: T) => K): Ref<UnwrapRef<K>>;
export function obs<T>(observable: IValueObservable<T> | IObservable<T>, initialValue: T): Ref<UnwrapRef<T>>;
export function obs<T>(observable: IValueObservable<T> | IObservable<T>): Ref<UnwrapRef<T>>;
export function obs<T, K>(observable: IValueObservable<T> | IObservable<T>, initValue?: T | ((e?: T) => K), mapValue?: (e?: T) => K): Ref<UnwrapRef<any>> {
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
