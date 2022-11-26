import type { ECS } from '../ecs/mod.ts';

export class GameLoop {
  #ecs: ECS;
  #lastRender = 0;
  #stop = false;
  #resolve?: () => void;
  #error?: (error: unknown) => void;

  get isRunning(): boolean {
    return !this.#stop;
  }

  constructor(ecs: ECS) {
    this.#ecs = ecs;
  }

  start() {
    this.#stop = false;
    return new Promise<void>((resolve, reject) => {
      this.#resolve = resolve;
      this.#error = reject;
      requestAnimationFrame((t) => this.#loop(t));
    });
  }

  stop() {
    this.#stop = true;
  }

  #loop(timestamp: number): void {
    try {
      const delta = timestamp - this.#lastRender;
      this.#lastRender = timestamp;

      this.#ecs.update(delta);

      if (!this.#stop) {
        requestAnimationFrame((t) => this.#loop(t));
      } else {
        this.#resolve?.();
      }
    } catch (error) {
      this.#error?.(error);
    }
  }
}
