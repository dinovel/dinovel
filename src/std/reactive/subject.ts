import type { IObservable, IObserver, IPipeable, ISubscription } from "./models.ts";
import { Subscriber } from './subscriber.ts';

/** Allow for multiple subscribers for one observer */
export class Subject<T> implements IObservable<T>, IObserver<T> {
  private _subscribers = new Set<Subscriber<T>>();
  private _completed = false;

  public get completed(): boolean {
    return this._completed;
  }

  public constructor() {}

  /** Notify all subscribers */
  public next(value: T): Promise<void> {
    if (this._completed) {
      throw new Error("Subject already completed");
    }

    return new Promise(res => {
      for (const subscriber of this._subscribers) {
        if (!subscriber.open) { continue; }
        try { subscriber.next(value); }
        catch { /** ignore */ }
      }
      res();
    });
  }

  /** Complete observable and notify all subscribers */
  public error(error: Error): Promise<void> {
    if (this._completed) {
      throw new Error("Subject already completed");
    }

    this._completed = true;

    return new Promise(res => {
      for (const subscriber of this._subscribers) {
        if (!subscriber.open) { continue; }
        try { subscriber.error(error); }
        catch { /** ignore */ }
      }
      res();
    });
  }

  /** Complete observable and notify all subscribers */
  public complete(): Promise<void> {
    if (this._completed) {
      throw new Error("Subject already completed");
    }

    this._completed = true;

    return new Promise(res => {
      for (const subscriber of this._subscribers) {
        if (!subscriber.open) { continue; }
        try { subscriber.complete(); }
        catch { /** ignore */ }
      }
      res();
    });
  }

  /** Subscribe to notifications */
  public subscribe(observer: Partial<IObserver<T>>): ISubscription {
    const sub = new Subscriber<T>(observer, this);
    this._subscribers.add(sub);
    return sub;
  }

  /** Close a subscription */
  public unsubscribe(subscription: ISubscription): void {
    this._subscribers.delete(subscription as Subscriber<T>);
  }

  /** Convert to promise */
  public asPromise(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.subscribe({
        next: resolve,
        error: reject,
      });
    });
  }

  /** Apply function */
  public pipe<U>(pipeable: IPipeable<T, U>): IObservable<U> {
    return pipeable(this);
  }
}
