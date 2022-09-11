import { LoggerService } from './logger.ts';

export const GLOBAL_LOGGER_KEY = Symbol.for('__DINOVEL_LOGGER__');

export const logger = new LoggerService();

// deno-lint-ignore no-explicit-any
(window as any)[GLOBAL_LOGGER_KEY] = logger;
