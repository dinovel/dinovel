import type { Plugin, EngineType, DinovelCore } from 'dinovel/engine/mod.ts';
import { Observable, Subject } from "rxjs";
import { EventBridge, EventMessage, PersistentEventSocket, EVENTS_ENDPOINT } from 'dinovel/std/events.ts';

export class ClientEventsPlugin implements Plugin {
  name = 'client-events';
  target: EngineType = 'client';
  inject(core: DinovelCore): void {
    const bridge = new ClientEventBridge();
    core.events.registerBridge(bridge);
    bridge.onReconnect.subscribe(() => core.events.emit('reconnect'));
    bridge.init();
  }
}

function createWebsocket() {
  const current = new URL(window.location.href);
  const wsUrl = `ws://${current.host}${EVENTS_ENDPOINT}`;
  return new WebSocket(wsUrl);
}

class ClientEventBridge implements EventBridge {
  private readonly _websocket: PersistentEventSocket;
  private readonly _reconnect = new Subject<void>();

  constructor() {
    this._websocket = new PersistentEventSocket(createWebsocket);
    this._websocket.onReconnect(() => this._reconnect.next());
  }

  public type = 'websocket-client';

  public send<T>(event: EventMessage<T>): void {
    this._websocket.send(event);
  }

  public get on(): Observable<EventMessage<unknown>> {
    return this._websocket.on;
  }

  public get onReconnect(): Observable<void> {
    return this._reconnect;
  }

  public init(): void {
    this._websocket.init(true);
  }
}
