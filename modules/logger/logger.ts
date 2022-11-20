import { ILogger, ILoggerFactory, LogLevel } from './models.ts';

export class Logger implements ILogger {
  #factory: ILoggerFactory;
  #section: string;

  constructor(factory: ILoggerFactory, section: string) {
    this.#factory = factory;
    this.#section = section;
  }

  fatal(message?: string, err?: Error, attr?: Record<string, unknown>): void {
    this.log(LogLevel.fatal, message, attr, err);
  }

  error(message?: string, err?: Error, attr?: Record<string, unknown>): void {
    this.log(LogLevel.error, message, attr, err);
  }

  warn(message?: string, attr?: Record<string, unknown>): void {
    this.log(LogLevel.warn, message, attr);
  }

  info(message?: string, attr?: Record<string, unknown>): void {
    this.log(LogLevel.info, message, attr);
  }

  debug(message?: string, attr?: Record<string, unknown>): void {
    this.log(LogLevel.debug, message, attr);
  }

  trace(message?: string, attr?: Record<string, unknown>): void {
    this.log(LogLevel.trace, message, attr);
  }

  log(level: LogLevel, message?: string, attr?: Record<string, unknown>, err?: Error): void {
    this.#factory.write({
      level,
      section: this.#section,
      message: message ?? '',
      time: new Date(),
      attr: attr ?? {},
      err,
    });
  }
}
