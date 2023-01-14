import type { IDinovel } from '../core/mod.ts';

export interface SceneInstance<T = unknown> {
  id: string;
  state?: T;
  preload?: (dinovel: IDinovel) => Promise<void> | void;
  start?: (dinovel: IDinovel) => Promise<void> | void;
  clear?: (dinovel: IDinovel) => Promise<void> | void;
}

export interface SceneBuilder {
  id: string;
  build: (dinovel: IDinovel) => Promise<SceneInstance> | SceneInstance;
}

export type Scene = SceneInstance | SceneBuilder;

/** Handle scenes lifecycle */
export interface ISceneHandler {
  /** Current loaded scenes */
  readonly currentScenes: string[];
  /** Scene to run between loading scenes */
  readonly loadingScene?: string;
  /** Register new scenes */
  register(...scenes: Scene[]): void;
  /** Load scenes */
  load(...sceneIds: string[]): Promise<void>;
  /** Clear current loaded scenes */
  clear(...sceneIds: string[]): Promise<void>;
  /** Set scene to run between loading scenes */
  setLoadingScene(sceneId: string): void;
}
