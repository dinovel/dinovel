import { IValueMap } from 'dinovel/std/value-map/models.ts';
import { Keys, MaybePromise } from 'dinovel/std/core/types.ts';

export type FormValidator = (value: string | undefined) => MaybePromise<true | string>;

export interface BaseFormValue {
  value: string | undefined;
  touched: boolean;
  validators: FormValidator[];
}

export interface FormValueGeneric<T> extends BaseFormValue {
  valueType: string;
}

export interface FormValueTyped<T> extends BaseFormValue {
  valueMap: IValueMap<T>;
}

export type FormValue<T> = FormValueGeneric<T> | FormValueTyped<T>;

export interface FormField<T> {
  v: FormValue<T>;
  // deno-lint-ignore no-explicit-any
  props: Record<string, any>;
  type: string;
}

export type FormGroup<T> = { [key in Keys<T>]: FormField<T[key]> };
