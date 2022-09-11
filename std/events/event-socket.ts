import { Observable, Subject } from "rxjs";
import { EventMessage } from "./event-message.ts";
import { logger } from "../logger.ts";

export class EventSocket {
  private readonly _listner = new Subject<EventMessage<unknown>>();
  private readonly _pending = new Set<EventMessage<unknown>>();
  private readonly _close$ = new Subject<void>();
  protected _websocket?: WebSocket;
  protected _ready = false;

  public get closed() {
    return !this._ready;
  }

  public get close$(): Observable<void> {
    return this._close$;
  }

  constructor(socket?: WebSocket) {
    if (socket instanceof WebSocket) {
      this._websocket = socket;
    }
  }

  public send<T>(event: EventMessage<T>): void {
    if (!this._websocket || !this._ready) {
      logger.debug('Websocket not ready, queuing event', event);
      this._pending.add(event);
      return;
    }

    try {
      this._websocket.send(JSON.stringify(event));
    } catch {
      this._pending.add(event);
    }
  }

  public get on(): Observable<EventMessage<unknown>> {
    return this._listner;
  }

  public init(): void {
    try {
      this._ready = false;

      if (this._websocket instanceof WebSocket) {
        this._websocket.onopen = () => this.onOpen();
        this._websocket.onmessage = e => this.onMessage(e);
        this._websocket.onclose = e => this.onClose(e);
        this._ready = true;
      }
    } catch (ex) {
      logger.error('Error connecting to websocket', ex);
    }
  }

  protected onClose(ev: CloseEvent): void {
    logger.debug('Websocket closed', ev.reason || '[no reason]');
    this._ready = false;
    this._websocket = undefined;
    this._close$.next();
  }

  private onMessage(ev: MessageEvent): void {
    try {
      const message = JSON.parse(ev.data) as EventMessage<unknown>;
      this._listner.next(message);
    } catch (e) {
      logger.error('Error parsing message', e, ev);
    }
  }

  private onOpen() {
    logger.debug('Websocket opened');
    this._ready = true;
    for (const event of this._pending) {
      this.send(event);
    }
    this._pending.clear();
  }
}

export class PersistentEventSocket extends EventSocket {
  private readonly _timeout;
  private readonly _create: () => WebSocket;
  #onReconnect?: () => void;

  constructor(create: () => WebSocket, timeout = 1000) {
    super();
    this._create = create;
    this._timeout = timeout;
  }

  public override init(reconnect = false): void {
    this._websocket = this._create();
    super.init();
    if (!this._ready) {
      setTimeout(() => this.init(reconnect), this._timeout);
    } else if (reconnect && this.#onReconnect) {
      this.#onReconnect();
    }
  }

  public onReconnect(callback: () => void | Promise<void>): void {
    this.#onReconnect = callback;
  }

  protected override onClose(ev: CloseEvent): void {
    super.onClose(ev);
    setTimeout(() => this.init(true), this._timeout);
  }

}
