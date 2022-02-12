// deno-lint-ignore-file no-empty-interface
import type { Reducer } from "./reducer.ts";
export interface Action {
  type: string | symbol;
}

export interface ActionPayload<T> extends Action {
  payload: T;
}

export type ActionPayloadCreator<T> = (payload: T) => ActionPayload<T>;
export type ActionCreator = () => Action;

export type ActionAnyCreator<T> =
  ((payload: T) => ActionPayload<T>)
  | (() => Action)
;

export interface ActionReducer<T> {
  type: string | symbol;
  apply: (state: T, action: Action) => T;
}

export interface JSONObject extends Record<string, JSONValue> {}
export interface JSONArray extends Array<JSONValue> {}
export type JSONValue = string | number | boolean | null | undefined | JSONObject | JSONArray;

export type StoreState = Record<string, JSONObject>;
export type StoreStateMap<T extends StoreState> = {
  [K in keyof T]: Reducer<T[K]>;
}
