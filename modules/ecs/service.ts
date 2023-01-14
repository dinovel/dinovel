import { Container, createToken } from '../infra/mod.ts';
import { ECS } from './ecs.ts';
import { LoggerFactoryService } from '../logger/mod.ts';
import { SaveHandlerService } from '../save/mod.ts';

export const ECSService = createToken<ECS>('ECSService', true);

export function registerECSService(target: Container) {
  target.register({
    token: ECSService,
    factory: [SaveHandlerService, LoggerFactoryService, ECS],
  });
}
