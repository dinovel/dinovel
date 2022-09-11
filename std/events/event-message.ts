export interface EmptyEventMessage {
  type: string;
  hasData: false;
}

export interface DataEventMessage<T> {
  type: string;
  hasData: true;
  data: T;
}

/** Message to be serialized */
export type EventMessage<T> = EmptyEventMessage | DataEventMessage<T>;

/** Message builder */
export function buildEventMessage<T>(type: string, data?: T): EventMessage<T> {
  return data === undefined ?
    { type, hasData: false }
    : { type, hasData: true, data };
}
