import { DinovelInit } from './init.ts';
import type  { DinovelCore } from './core.ts';

export let Dinovel!: DinovelCore;
export const initHandler = new DinovelInit();

// deno-lint-ignore no-explicit-any
(globalThis as any).__INIT__ = initHandler;

initHandler.onInit.subscribe(dinovel => {
  Dinovel = dinovel;
  // deno-lint-ignore no-explicit-any
  (globalThis as any).__DINOVEL__ = dinovel;
});

export * from './core.ts';
export * from './events.ts';
export * from './plugin.ts';
