import { Keys } from 'dinovel/std/core/types.ts';
import type { EventsHandler } from 'dinovel/std/core/events.ts';
import { AppEvents } from '../models.ts';

// deno-lint-ignore no-explicit-any
const _handlers: [string, (...args: any[]) => any][] = [];
let _events: EventsHandler<AppEvents> | undefined;

export function registerHandler<T extends Keys<AppEvents>>(event: T, handler: (data: AppEvents[T]) => void) {
  _handlers.push([event, handler]);
  if (_events) { _events.on(event, handler); }
}

export function setEventHandler(events: EventsHandler<AppEvents>) {
  _events = events;
  // deno-lint-ignore no-explicit-any
  _handlers.forEach(([event, handler]) => events.on(event as any, handler));
}
