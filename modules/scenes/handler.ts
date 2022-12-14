import type { IDinovel } from '../core/mod.ts';
import { ILogger, ILoggerFactory } from '../logger/mod.ts';
import { ISceneHandler, Scene, SceneBuilder, SceneInstance } from './models.ts';

declare const Dinovel: IDinovel | undefined;

export class SceneHandler implements ISceneHandler {
  #scenes = new Map<string, Scene>();
  #loadedScenes: SceneInstance[] = [];
  #loadingScene?: string;
  #logger: ILogger;

  get #dinovel() {
    if (!Dinovel) {
      throw new Error('Dinovel is not defined');
    }

    return Dinovel;
  }

  get currentScenes() {
    return this.#loadedScenes.map((s) => s.id);
  }

  get loadingScene() {
    return this.#loadingScene;
  }

  constructor(logger: ILoggerFactory) {
    this.#logger = logger.createLogger('SceneHandler');
  }

  register(...scenes: Scene[]) {
    for (const scene of scenes) {
      if (this.#scenes.has(scene.id)) {
        this.#logger.warn(`Scene ${scene.id} is already registered`);
        continue;
      }

      this.#scenes.set(scene.id, scene);
    }
  }

  setLoadingScene(sceneId: string): void {
    this.#loadingScene = sceneId;
  }

  async load(...sceneIds: string[]) {
    for (const sceneId of sceneIds) {
      const s = this.#scenes.get(sceneId);
      if (!s) {
        this.#logger.warn(`Scene ${sceneId} is not registered`);
        continue;
      }

      try {
        await this.#loadScene(s);
      } catch (err) {
        this.#logger.error(`Failed to load scene ${sceneId}`, err);
      }
    }
  }

  async clear() {
    for (const scene of this.#loadedScenes) {
      try {
        await this.#clearScene(scene);
      } catch (err) {
        this.#logger.error(`Failed to clear scene ${scene.id}`, err);
      }
    }
    this.#loadedScenes = [];
  }

  async #loadScene(scene: Scene) {
    const s = isSceneInstance(scene) ? await scene.build(this.#dinovel) : scene;

    if (s.preload) {
      await s.preload(this.#dinovel);
    }

    if (s.start) {
      await s.start(this.#dinovel);
    }

    this.#loadedScenes.push(s);
  }

  async #clearScene(scene: SceneInstance) {
    if (scene.clear) {
      await scene.clear(this.#dinovel);
    }
  }
}

function isSceneInstance(scene: Scene): scene is SceneBuilder {
  return 'id' in scene && 'build' in scene && typeof scene.build === 'function';
}
