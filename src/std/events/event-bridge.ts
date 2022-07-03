import type { EventMessage } from './event-message.ts';
import type { Observable } from 'rxjs';

/** Serializes/Deserializes events and send to clients */
export interface EventBridge {
  type: string;
  send<T>(event: EventMessage<T>): void;
  get on(): Observable<EventMessage<unknown>>;
}
