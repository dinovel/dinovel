import { ILog, ILogWriter, LogLevel } from './models.ts';

export abstract class BaseLogWriter implements ILogWriter {
  #level: LogLevel = LogLevel.info;

  get level() {
    return this.#level;
  }

  write(log: ILog) {
    if (log.level <= this.#level) {
      this.writeLog(log);
    }
  }

  protected abstract writeLog(log: ILog): void;

  setLevel(level: LogLevel) {
    this.#level = level;
  }
}
