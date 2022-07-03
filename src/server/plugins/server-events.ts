import type { Plugin, EngineType, DinovelCore, Server } from 'dinovel/engine/mod.ts';
import { EventBridge, EventMessage, EVENTS_ENDPOINT, EventSocket } from 'dinovel/std/events.ts';
import { Observable, Subject } from "rxjs";

export class ServerEventsPlugin implements Plugin {
  name = "server-events";
  target: EngineType = "server";
  inject(core: DinovelCore): void {
    const bridge = new ServerEventBridge();
    const router = (core.engine as Server).router;
    router.get(EVENTS_ENDPOINT, async ctx => {
      if (!ctx.isUpgradable) {
        ctx.throw(501);
      }

      const ws = await ctx.upgrade();
      bridge.registerSocket(ws);
    });
    core.events.registerBridge(bridge);
  }
  start(_core: DinovelCore): void {}
  stop(_core: DinovelCore): void {}
}

class ServerEventBridge implements EventBridge {
  private readonly _sockets = new Set<EventSocket>();
  private readonly _listner = new Subject<EventMessage<unknown>>();
  public type = "websocket-server";

  public send<T>(event: EventMessage<T>): void {
    for (const socket of this._sockets) {
      if (socket.closed) { continue; }
      socket.send(event);
    }
  }

  public get on(): Observable<EventMessage<unknown>> {
    return this._listner;
  }

  public registerSocket(socket: WebSocket): void {
    const eventSocket = new EventSocket(socket);
    this._sockets.add(eventSocket);
    const sub = eventSocket.on.subscribe(msg => this._listner.next(msg));
    eventSocket.close$.subscribe(() => {
      sub.unsubscribe();
      this._sockets.delete(eventSocket);
    });
  }
}
