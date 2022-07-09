import { JSONObject, deepFreeze, deepEqual } from '../helpers.ts'
import { Module, ActionReducer, Action, ActionBuilder, ActionBuilderNoPayload, ActionBuilderWithPayload, ActionWithPayload } from './models.ts';
import { BehaviorSubject, Observable } from 'rxjs';

class ModuleHandler<T extends JSONObject> implements Module<T> {
  readonly #state: BehaviorSubject<T>;
  readonly #reducers: Map<string | symbol, ActionReducer<T>>;
  #name = '';

  public get name(): string { return this.#name; }

  public get state(): Observable<T> { return this.#state; }

  public get currentState(): T { return this.#state.value; }

  public constructor(state: T, reducers: ActionReducer<T>[]) {
    this.#state = new BehaviorSubject(state);
    this.#reducers = new Map();
    this.add(reducers);
  }

  public add(reducers: ActionReducer<T>[]): void {
    reducers.forEach(reducer => this.#reducers.set(reducer.type, reducer));
  }

  public remove(reducer: (string | symbol)[]): void {
    reducer.forEach(type => this.#reducers.delete(type));
  }

  public setName(name: string): void {
    this.#name = name;
  }

  public apply(action: Action): boolean {
    const reducer = this.#reducers.get(action.type);
    if (!reducer) return false;
    const newState = reducer.apply(this.#state.value, action);
    return this.nextState(newState);
  }

  public reset(state: T): boolean {
    const newState = {
      ...this.#state.value,
      ...state,
    }
    return this.nextState(newState);
  }

  private nextState(newState: T): boolean {
    if (deepEqual(newState, this.#state.value)) return false;
    this.#state.next(deepFreeze(newState));
    return true;
  }
}

/**
 * Create a new store module
 *
 * @param initialState Initial state to be stored
 * @param reducers Reducers to be applied to the state
 * @returns Store module
 */
export function createModule<T extends JSONObject>(
  initialState: T,
  ...reducers: ActionReducer<T>[]
): Module<T> {
  return new ModuleHandler(initialState, reducers);
}

/** Create reducer for an action */
export function on<T>(action: ActionBuilderNoPayload, reducer: (state: T, action: Action) => T): ActionReducer<T>;
/** Create reducer for an action with payload */
export function on<T, U>(action: ActionBuilderWithPayload<U>, reducer: (state: T, action: ActionWithPayload<U>) => T): ActionReducer<T>;
// deno-lint-ignore no-explicit-any
export function on<T>(action: ActionBuilder<any>, reducer: (state: T, action: any) => T): ActionReducer<T> {
  return {
    type: action({}).type,
    apply: reducer,
  };
}
