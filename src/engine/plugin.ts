import type { DinovelCore } from "./core.ts";

/** Dinovel plugin to be loaded at runtime */
export interface Plugin {
  /** Name of the plugin */
  readonly name: string;
  /** Called during dinovel init */
  inject?: (core: DinovelCore) => void | Promise<void>;
  /** Called after dinovel has started */
  start?: (core: DinovelCore) => void | Promise<void>;
  /** Called after dinovel has stopped */
  stop?: (core: DinovelCore) => void | Promise<void>;
}
