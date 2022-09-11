import type { JSONValue, JSONObject } from '../helpers.ts'
import type { Store } from './store.ts';
import { Observable } from 'rxjs';

/** Action to commit to state */
export interface Action { type: string | symbol; }
/** Action with payload to commit to state */
export interface ActionWithPayload<T> extends Action { payload: T; }

/** Fn to build an action without payload */
export type ActionBuilderNoPayload = () => Action;
/** Fn to build an action with payload */
export type ActionBuilderWithPayload<T> = (payload: T) => ActionWithPayload<T>;
/** Fn to build an action with or without payload */
export type ActionBuilder<T> = ActionBuilderNoPayload | ActionBuilderWithPayload<T>;

/** Reducer for a state action */
export interface ActionReducer<T> {
  type: string | symbol;
  apply: (state: T, action: Action) => T;
}

/** Reducers for state */
export interface Module<T extends JSONValue> {
  /** Name of state in store */
  readonly name: string;

  /** State that can be subscribed to */
  readonly state: Observable<T>;

  /** Current state */
  readonly currentState: T;

  /** Update state name */
  setName(name: string): void;

  /** Apply action to the store */
  apply: (action: Action) => boolean;

  /** Reset the current state */
  reset: (state: T) => boolean;

  /** Add reducers for current state */
  add: (reducers: ActionReducer<T>[]) => void;

  /** Remove reducers for current state */
  remove: (reducer: (string | symbol)[]) => void;
}

/** States for store */
export type StoreState = Record<string, JSONObject>;
/** Reducers for store */
export type StoreModules<T extends StoreState> = {
  [K in keyof T]: Module<T[K]>;
}

/** Plugin to add funcionality to store */
export interface StorePlugin<T extends StoreState> {
  /** Plugin id */
  readonly id: string;

  /** Initialize plugin */
  init?: (store: Store<T>) => void;

  /** Action was dispatched */
  action?: (action: Action) => void;

  /** State to be exported */
  export?: (out: Record<string, unknown>) => void;

  /** State to be imported */
  import?: (inp: Record<string, unknown>) => void;
}
