import { IDinovel } from './models.ts';
import { Container } from '../infra/container.ts';
import { ECS, ECSService } from '../ecs/mod.ts';
import { ILoggerFactory, LoggerFactoryService } from '../logger/mod.ts';
import {
  ColorHandlerService,
  IColorHandler,
  ILayerHandler,
  IStyleBuilder,
  LayerHandlerService,
  StyleBuilderService,
} from '../render/mod.ts';
import { GameLoop } from './game-loop.ts';
import { IUIStore, UIStoreService } from '../ui/mod.ts';

export class Dinovel implements IDinovel {
  #container: Container;
  #gameloop?: GameLoop;

  constructor(container: Container) {
    this.#container = container;
  }

  get container(): Container {
    return this.#container;
  }

  get ecs(): ECS {
    return this.#container.get(ECSService);
  }

  get logger(): ILoggerFactory {
    return this.#container.get(LoggerFactoryService);
  }

  get layers(): ILayerHandler {
    return this.#container.get(LayerHandlerService);
  }

  get colors(): IColorHandler {
    return this.#container.get(ColorHandlerService);
  }

  get styles(): IStyleBuilder {
    return this.#container.get(StyleBuilderService);
  }

  get webUI(): IUIStore {
    return this.#container.get(UIStoreService);
  }

  start(): Promise<void> {
    if (this.#gameloop?.isRunning) {
      throw new Error('Dinovel game loop is already running.');
    }

    this.styles.render();
    const gameloop = new GameLoop(this.ecs);
    this.#gameloop = gameloop;

    return gameloop.start();
  }

  stop(): void {
    this.#gameloop?.stop();
  }
}
