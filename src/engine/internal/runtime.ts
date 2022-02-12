import { DinovelRuntime } from 'dinovel/std/core/config.ts';

let internalRuntime: DinovelRuntime | undefined = undefined;

export function setRuntime(runtime: DinovelRuntime) {
  internalRuntime = runtime;
}

export function getRuntime(): DinovelRuntime {
  if (internalRuntime === undefined) {
    throw new Error('Dinovel runtime is not available!');
  }
  return internalRuntime;
}
