import { LoggerFactoryService } from '../logger/service.ts';
import { Container, createToken } from '../infra/mod.ts';
import { ISceneHandler } from './models.ts';
import { SceneHandler } from './handler.ts';

export const ScenesHandlerService = createToken<ISceneHandler>('ScenesHandlerService', true);

export function registerScenesService(target: Container): void {
  target.register({
    token: ScenesHandlerService,
    factory: [LoggerFactoryService, SceneHandler],
  });
}
