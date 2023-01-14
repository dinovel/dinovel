import { LoggerFactoryService } from '../logger/service.ts';
import { Container, createToken } from '../infra/mod.ts';
import { ISaveHandler } from './models.ts';
import { SaveHandler } from './handler.ts';

export const SaveHandlerService = createToken<ISaveHandler>('SaveHandlerService', true);

export function registerSaveService(target: Container): void {
  target.register({
    token: SaveHandlerService,
    factory: [LoggerFactoryService, SaveHandler],
  });
}
