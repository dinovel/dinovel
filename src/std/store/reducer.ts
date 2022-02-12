// deno-lint-ignore-file no-explicit-any
import type { ActionReducer, Action, ActionAnyCreator, ActionPayload, ActionPayloadCreator, ActionCreator, JSONObject } from './models.ts';
import { IValueObservable } from '../reactive/models.ts';
import { ValueSubject } from '../reactive/value-subject.ts';
import {
  deepEqual,
  deepFreeze,
} from './utils.ts';

export class Reducer<T extends JSONObject> {
  private readonly reducers: ActionReducer<T>[];
  private _state: ValueSubject<T>;
  private _name = '';

  public get state(): IValueObservable<T> {
    return this._state;
  }

  /** Name in store */
  public get name(): string {
    return this._name;
  }

  public constructor(state: T, ...reducers: ActionReducer<T>[]) {
    this._state = new ValueSubject(deepFreeze(state));
    this.reducers = reducers;
  }

  public apply(action: Action): void {
    const reducer = this.reducers.find(reducer => reducer.type === action.type);
    if (!reducer) return;
    const newState = reducer.apply(this._state.value, action);
    if (deepEqual(newState, this._state.value)) return;
    this._state.next(deepFreeze(newState));
  }

  public setName(name: string): void {
    this._name = name;
  }

  public resetState(state: T): void {
    this._state.next(deepFreeze(state));
  }
}

export function on<T>(action: ActionCreator, reducer: (state: T, action: Action) => T): ActionReducer<T>;
export function on<T, U>(action: ActionPayloadCreator<U>, reducer: (state: T, action: ActionPayload<U>) => T): ActionReducer<T>;
export function on<T>(action: ActionAnyCreator<any>, reducer: (state: T, action: any) => T): ActionReducer<T> {
  return {
    type: action({}).type,
    apply: reducer,
  };
}


export function createReducer<T extends JSONObject>(initialState: T, ...reducers: ActionReducer<T>[]): Reducer<T> {
  return new Reducer(initialState, ...reducers);
}
