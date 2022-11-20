import { container, createToken } from '../infra/mod.ts';
import { ILogger, ILoggerFactory } from './models.ts';
import { LoggerFactory } from './logger-factory.ts';

export const LoggerFactoryService = createToken<ILoggerFactory>('LoggerFactoryService', true);

container.register({
  token: LoggerFactoryService,
  factory: [LoggerFactory],
});

export function createLogger(section: string): ILogger {
  return container.get(LoggerFactoryService).createLogger(section);
}
