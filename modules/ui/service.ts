import { Container, createToken } from '../infra/mod.ts';
import { LoggerFactoryService } from '../logger/mod.ts';
import { IUIStore, UIStore } from './ui-store.ts';

export const UIStoreService = createToken<IUIStore>('UIStoreService', true);

export function registerUIStoreService(target: Container) {
  target.register({
    token: UIStoreService,
    factory: [LoggerFactoryService, UIStore],
  });
}
