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

  public override subscribe(observer: Partial<IObserver<T>>): ISubscription {
    const sub = super.subscribe(observer);

    const { next } = observer;
    if (next && sub.open && !this.completed) {
      next(this._value);
    }

    return sub;
  }
}
