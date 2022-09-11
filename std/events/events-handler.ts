// deno-lint-ignore-file ban-types
import type { EventBridge } from './event-bridge.ts';
import { buildEventMessage, EventMessage } from './event-message.ts';
import { Observable, Subject, Subscription } from 'rxjs';
import { Keys } from "../helpers/typing.ts";

/** Handle engine envents */
export class EventsHandler<T extends object> {
  private readonly _bridges: Map<string, EventBridge> = new Map();
  private readonly _listners: Map<string, Subscription> = new Map();
  private readonly _topics: Map<string, Subject<unknown>> = new Map();

  /**
   * Emit a new event topic to all listeners
   *
   * @param event event name
   * @param data event data
   */
   public emit<K extends Keys<T>>(event: K, ...data: T[K] extends never ? [undefined?] : [T[K]]): void {
    if (event === '*') throw new Error("Cannot emit '*' event");

    const message = buildEventMessage(event, data[0]);

    // send to internal listeners
    this.emitTopic(message);

    // send to all bridges
    for (const [_, bridge] of this._bridges) {
      bridge.send(message);
    }
  }

  /** Subscribe to an event */
  public on(event: '*'): Observable<EventMessage<unknown>>
  public on<K extends Keys<T>>(event: K): Observable<T[K]>;
  public on<K extends Keys<T>>(event: K): Observable<T[K]> {
    return this.ensureSubject(event);
  }

  /** Register bridge, so it will send/read all future events */
  public registerBridge(bridge: EventBridge): void {
    this.disposeBridge(bridge.type);
    this._bridges.set(bridge.type, bridge);
    this._listners.set(
      bridge.type,
      bridge.on.subscribe(message => this.emitTopic(message))
    );
  }

  /** Stop send/read events from a bridge */
  public disposeBridge(type: string): void {
    this._bridges.delete(type);
    this._listners.get(type)?.unsubscribe();
  }

  /** Handles new types */
  public add<U extends object>(): EventsHandler<U & T> {
    return this as unknown as EventsHandler<U & T>;
  }

  /** Limit to a subset of types */
  public for<U extends object>(): EventsHandler<U> {
    return this as unknown as EventsHandler<U>;
  }

  /** Emit topic to internal subscribers */
  private emitTopic(event: EventMessage<unknown>): void {
    if (this._topics.has(event.type)) {
      if (event.hasData) {
        this.ensureSubject(event.type).next(event.data);
      } else {
        this.ensureSubject(event.type).next({});
      }
    }

    // send to generic topic
    this.ensureSubject('*').next(event);
  }

  private ensureSubject<T>(topic: string): Subject<T> {
    let subject = this._topics.get(topic);
    if (!subject) {
      subject = new Subject<unknown>();
      this._topics.set(topic, subject);
    }
    return subject as Subject<T>;
  }
}
