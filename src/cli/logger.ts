import {
  InternalLoggerEngine,
  LoggerEngine,
  LoggerService,
  LogLevel,
} from 'dinovel/std/logger.ts';

const logColor = {
  [LogLevel.debug]: '\x1b[0m',
  [LogLevel.info]: '\x1b[36m',
  [LogLevel.engine]: '\x1b[32m',
  [LogLevel.warning]: '\x1b[33m',
  [LogLevel.error]: '\x1b[31m',
};

function log(level: number, message: string, ...params: unknown[]) {
  const color = logColor[level as unknown as keyof typeof logColor] || logColor[LogLevel.debug];
  const reset = '\x1b[0m';

  console.log(`${color}${message}${reset}`, ...params);
}

const engine: LoggerEngine = {
  debug: (message, ...params) => log(LogLevel.debug, message, ...params),
  info: (message, ...params) => log(LogLevel.info, message, ...params),
  warning: (message, ...params) => log(LogLevel.warning, message, ...params),
  error: (message, ...params) => log(LogLevel.error, message, ...params),
  engine: (message, ...params) => log(LogLevel.engine, message, ...params),
  default: (message, ...params) => log(LogLevel.all, message, ...params),
};

export const logger = new LoggerService();
logger.removeEngine(InternalLoggerEngine);
logger.addEngine(engine);
