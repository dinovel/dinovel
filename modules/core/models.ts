import type { ECS } from '../ecs/mod.ts';
import type { Container } from '../infra/mod.ts';
import type { ILoggerFactory } from '../logger/mod.ts';
import type { IColorHandler, ILayerHandler, IStyleBuilder } from '../render/mod.ts';

export interface IDinovel {
  readonly container: Container;
  readonly ecs: ECS;
  readonly logger: ILoggerFactory;
  readonly layers: ILayerHandler;
  readonly colors: IColorHandler;
  readonly styles: IStyleBuilder;

  start(): Promise<void>;
  stop(): void;
}

export interface InitOptions {
  /** Document to render components */
  rootDocument: Document;
  /** Container to use for dependency injection */
  depsContainer?: Container;
  /** Whether to register default services */
  registerDefaults?: boolean;
}
