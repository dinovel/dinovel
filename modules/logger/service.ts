import { Container, createToken } from '../infra/mod.ts';
import { ILoggerFactory } from './models.ts';
import { LoggerFactory } from './logger-factory.ts';

export const LoggerFactoryService = createToken<ILoggerFactory>('LoggerFactoryService', true);

export function registerLoggerServices(target: Container) {
  target.register({
    token: LoggerFactoryService,
    factory: [LoggerFactory],
  });
}
