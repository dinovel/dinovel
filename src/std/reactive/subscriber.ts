import type { IObserver, ISubscription, IObservable } from "./models.ts";

/** Instance of an observable subscriber */
export class Subscriber<T> implements IObserver<T>, ISubscription {

  private _closed = false;

  public get open(): boolean {
    return !this._closed;
  }

  public constructor(
    /** Observer to use */
    private readonly _observer: Partial<IObserver<T>>,
    /** Parent observable to unsubscribe to */
    private readonly _parent?: IObservable<T>,
  ) {}

  public next(value: T): void {
    if (this._closed) {
      return;
    }
    this._observer.next && this._observer.next(value);
  }

  public error(error: Error): void {
    if (this._closed) {
      return;
    }
    this._closed = true;
    this._observer.error && this._observer.error(error);
  }

  public complete(): void {
    if (this._closed) {
      return;
    }
    this._closed = true;
    this._observer.complete && this._observer.complete();
  }

  public unsubscribe(): void {
    this._closed = true;
    this._parent?.unsubscribe(this);
  }
}
