import type { IObserver, ISubscription, IValueObservable } from "./models.ts";
import { Subject } from './subject.ts';

/** Like Subject but allways emit the last value to subscribers */
export class ValueSubject<T> extends Subject<T> implements IValueObservable<T> {
  private _value: T;

  public get value(): T {
    return this._value;
  }

  public constructor(value: T) {
    super();
    this._value = value;
  }

  public override next(value: T): Promise<void> {
    this._value = value;
    return super.next(value);
  }

  public subscribe(next: (value: T) => (unknown | Promise<unknown>)): ISubscription;
  public subscribe(observer: Partial<IObserver<T>>): ISubscription;
  public subscribe(observer: Partial<IObserver<T>> | ((value: T) => (unknown | Promise<unknown>))): ISubscription {
    const obs: Partial<IObserver<T>> = typeof observer === "function" ? { next: observer } : observer;
    const sub = super.subscribe(obs);

    const { next } = obs;
    if (next && sub.open && !this.completed) {
      next(this._value);
    }

    return sub;
  }
}
