export interface ExceptionEvents {
  /** Unhandled exception */
  exception: Error;
}

export interface UnknowEvent {
  /** Unknown event with data */
  unknwon: unknown;
  /** Unknown event */
  void: never;
}

export type EngineEvents = ExceptionEvents & UnknowEvent;
