import type { ECS } from '../ecs/mod.ts';
import type { Container } from '../infra/mod.ts';
import type { ILoggerFactory, LogLevel } from '../logger/mod.ts';
import type { IColorHandler, ILayerHandler, IStyleBuilder } from '../render/mod.ts';
import { IUIStore } from '../ui/mod.ts';

export interface IDinovel {
  readonly container: Container;
  readonly ecs: ECS;
  readonly logger: ILoggerFactory;
  readonly layers: ILayerHandler;
  readonly colors: IColorHandler;
  readonly styles: IStyleBuilder;
  readonly webUI: IUIStore;

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
  /** Log level to use */
  logLevel?: LogLevel;
}
