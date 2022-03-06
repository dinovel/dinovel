import type {
  IObserver,
  ISubscription,
} from './models.ts';
import { Subject } from './subject.ts';

/** Like subject, but push all previous values to new subscribers */
export class ReplaySubject<T> extends Subject<T> {
  private readonly _values: T[];

  public get values(): T[] {
    return this._values;
  }

  public constructor(...initialValues: T[]) {
    super();
    this._values = initialValues;
  }

  public override next(value: T): Promise<void> {
    this._values.push(value);
    return super.next(value);
  }

  public subscribe(next: (value: T) => (unknown | Promise<unknown>)): ISubscription;
  public subscribe(observer: Partial<IObserver<T>>): ISubscription;
  public subscribe(observer: Partial<IObserver<T>> | ((value: T) => (unknown | Promise<unknown>))): ISubscription {
    const obs: Partial<IObserver<T>> = typeof observer === "function" ? { next: observer } : observer;

    for (const value of this._values) {
      obs.next && obs.next(value);
    }

    return super.subscribe(obs);
  }

}
