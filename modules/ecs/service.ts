import { Container, createToken } from '../infra/mod.ts';
import { ECS } from './ecs.ts';

export const ECSService = createToken<ECS>('ECSService', true);

export function registerECSService(target: Container) {
  target.register({
    token: ECSService,
    factory: [ECS],
  });
}
