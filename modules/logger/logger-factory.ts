import { Logger } from './logger.ts';
import { ILog, ILogFormatter, ILogger, ILoggerFactory, ILogWriter, LogLevel } from './models.ts';

export class LoggerFactory implements ILoggerFactory {
  #writers: ILogWriter[] = [];
  #formatters: ILogFormatter[] = [];

  createLogger(section: string): ILogger {
    return new Logger(this, section);
  }

  write(log: ILog): void {
    this.#formatters.forEach((formatter) => formatter.format(log));
    this.#writers.forEach((writer) => writer.write(log));
  }

  use(plugin: ILogWriter | ILogFormatter): void {
    if (isLogWriter(plugin)) {
      this.#writers.push(plugin);
    } else {
      this.#formatters.push(plugin);
    }
  }

  disable(remove: (e: ILogWriter | ILogFormatter) => boolean): void {
    this.#writers = this.#writers.filter((e) => !remove(e));
    this.#formatters = this.#formatters.filter((e) => !remove(e));
  }

  setLogLevel(level: LogLevel): void {
    this.#writers.forEach((writer) => writer.setLevel(level));
  }
}

function isLogWriter(plugin: ILogWriter | ILogFormatter): plugin is ILogWriter {
  return typeof (plugin as ILogWriter).write === 'function';
}
