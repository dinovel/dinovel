/** Object that handles notifications */
export interface IObserver<T> {
  /** Notify observer of a new value */
  next(value: T): unknown | Promise<unknown>;
  /** Notify observer of an error */
  error(error: Error): unknown | Promise<unknown>;
  /** Notify observer has completed */
  complete(): unknown | Promise<unknown>;
}

/** Allow to cancel a subscription */
export interface ISubscription {
  /** Close subscription */
  unsubscribe(): void;
  /** Get subscription status */
  get open(): boolean;
}

/** Allow to subscribe for notifications */
export interface IObservable<T> {
  /** Completetion state */
  get completed(): boolean;

  /** Subscribe to the observable */
  subscribe(observer: Partial<IObserver<T>>): ISubscription;

  /** Close a subscription */
  unsubscribe(subscription: ISubscription): void;

  /** Convert to promise */
  asPromise(): Promise<T>;

  /** Apply function */
  pipe<U>(pipeable: IPipeable<T, U>): IObservable<U>;
}

export interface IValueObservable<T> extends IObservable<T> {
  /** Get current value */
  get value(): T;
}

export type IPipeable<T, U> = (input: IObservable<T>) => IObservable<U>;
