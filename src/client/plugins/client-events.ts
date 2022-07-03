import type { Plugin, EngineType, DinovelCore } from 'dinovel/engine/mod.ts';
import type { Observable } from "rxjs";
import { EventBridge, EventMessage, PersistentEventSocket, EVENTS_ENDPOINT } from 'dinovel/std/events.ts';

export class ClientEventsPlugin implements Plugin {
  name = 'client-events';
  target: EngineType = 'client';
  inject(core: DinovelCore): void {
    const bridge = new ClientEventBridge();
    core.events.registerBridge(bridge);
    bridge.init();
  }
  start(_core: DinovelCore): void { }
  stop(_core: DinovelCore): void { }
}

function createWebsocket() {
  const current = new URL(window.location.href);
  const wsUrl = `ws://${current.host}${EVENTS_ENDPOINT}`;
  return new WebSocket(wsUrl);
}

class ClientEventBridge implements EventBridge {
  private readonly _websocket: PersistentEventSocket;

  constructor() {
    this._websocket = new PersistentEventSocket(createWebsocket);
  }

  public type = 'websocket-client';

  public send<T>(event: EventMessage<T>): void {
    this._websocket.send(event);
  }

  public get on(): Observable<EventMessage<unknown>> {
    return this._websocket.on;
  }

  public init(): void {
    this._websocket.init();
  }
}
