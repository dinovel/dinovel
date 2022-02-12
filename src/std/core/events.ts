// deno-lint-ignore-file ban-types
import type { Keys } from './types.ts';

import {
  ISubscription,
  Subject,
} from '../reactive/__.ts';

/** Push and subscribe to events */
export class EventsHandler<T extends object> {
  private readonly _events: Map<string, Subject<unknown>> = new Map();

  /**
   * Emit a new event
   *
   * @param event event name
   * @param data event data
   */
   public emit<K extends Keys<T>>(event: K, ...data: T[K] extends never ? [undefined?] : [T[K]]): void {
    if (!this._events.has(event)) return; // don't emit if no listeners
    this.getSubject(event).next(data[0] as T[K]);
  }

  /** Subscribe to an event */
  public on<K extends Keys<T>>(event: K, callback: (data: T[K]) => void): ISubscription {
    return this.getSubject<T[K]>(event).subscribe({
      next: callback,
    });
  }

  /** Handles new types */
  public add<U extends object>(): EventsHandler<U & T> {
    return this as unknown as EventsHandler<U & T>;
  }

  /** Limit to a subset of types */
  public for<U extends object>(): EventsHandler<U> {
    return this as unknown as EventsHandler<U>;
  }

  private getSubject<T>(event: string): Subject<T> {
    if (!this._events.has(event)) {
      this._events.set(event, new Subject());
    }
    return this._events.get(event) as Subject<T>;
  }
}
