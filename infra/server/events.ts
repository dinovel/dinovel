import { EventBridge, EventMessage, EventSocket, EVENTS_ENDPOINT, EventsHandler } from 'dinovel/std/events.ts';
import type { DinovelEvents } from 'dinovel/engine/events.ts';
import { Observable, Subject } from "rxjs";
import { Router } from 'oak';

export function registerEvents(router: Router): EventsHandler<DinovelEvents> {
  const bridge = new ServerEventBridge();
  router.get(EVENTS_ENDPOINT, async ctx => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }

    const ws = await ctx.upgrade();
    bridge.registerSocket(ws);
  });

  const handler = new EventsHandler<DinovelEvents>();
  handler.registerBridge(bridge);
  return handler;
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
    eventSocket.init();
  }
}
