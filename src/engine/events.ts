import type { OpenDialogEvent, CloseDialogEvent } from 'dinovel/dialog/dialog.model.ts';

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

export interface DialogEvents {
  /** Dialog is opened */
  dnDialogOpen: OpenDialogEvent<unknown>;
  /** Dialog is closed */
  dnDialogClose: CloseDialogEvent<unknown>;
}

export type EngineEvents = ExceptionEvents & UnknowEvent & DialogEvents;
