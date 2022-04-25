import type { DinovelRuntime } from 'dinovel/std/core/config.ts';
import type { DialogHandler } from 'dinovel/dialog/dialog.handler.ts';

let internalRuntime: DinovelRuntime | undefined = undefined;
let dialogHandler: DialogHandler | undefined = undefined;

export function setRuntime(runtime: DinovelRuntime) {
  internalRuntime = runtime;
}

export function getRuntime(): DinovelRuntime {
  if (internalRuntime === undefined) {
    throw new Error('Dinovel runtime is not available!');
  }
  return internalRuntime;
}

export function setDialogHandler(handler: DialogHandler) {
  dialogHandler = handler;
}

export function getDialogHandler(): DialogHandler {
  if (dialogHandler === undefined) {
    throw new Error('Dialog handler is not available!');
  }
  return dialogHandler;
}

export function setDinovelInternals(
  runtime: DinovelRuntime,
  handler: DialogHandler
) {
  setRuntime(runtime);
  setDialogHandler(handler);
}
