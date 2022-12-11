export enum LogLevel {
  quiet = 0,
  fatal = 10,
  error = 20,
  warn = 30,
  info = 40,
  debug = 50,
  trace = 60,
}

export interface ILogger {
  fatal: (message?: string, err?: Error, attr?: Record<string, unknown>) => void;
  error: (message?: string, err?: Error, attr?: Record<string, unknown>) => void;
  warn: (message?: string, attr?: Record<string, unknown>) => void;
  info: (message?: string, attr?: Record<string, unknown>) => void;
  debug: (message?: string, attr?: Record<string, unknown>) => void;
  trace: (message?: string, attr?: Record<string, unknown>) => void;
}

export interface ILog {
  level: LogLevel;
  section: string;
  message: string;
  time: Date;
  attr: Record<string, unknown>;
  err?: Error;
}

export interface ILogWriter {
  write: (log: ILog) => void;
  setLevel: (level: LogLevel) => void;

  readonly level: LogLevel;
}

export interface ILogFormatter {
  format: (log: ILog) => void;
}

export interface ILoggerFactory {
  createLogger: (section: string) => ILogger;
  write: (log: ILog) => void;

  use(plugin: ILogWriter | ILogFormatter): void;
  disable(remove: (e: ILogWriter | ILogFormatter) => boolean): void;

  setLogLevel(level: LogLevel): void;
}
