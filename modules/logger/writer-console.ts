import { ILog, LogLevel } from './models.ts';
import { BaseLogWriter } from './writer.base.ts';

export class LogWriterConsole extends BaseLogWriter {
  #name;
  #console: Console;

  constructor(name?: string, output = console) {
    super();
    this.#name = name ?? 'Dinovel';
    this.#console = output;
  }

  writeLog(log: ILog) {
    const color = getColor(log.level);
    const message = log.level !== LogLevel.trace
      ? `[${LogLevel[log.level]}] ${log.section} > ${log.message}`
      : `[${LogLevel[log.level]}] ${this.#name} | ${log.section} > ${log.message}`;

    const output = applyColor(color, [message]);

    this.#log(log.level, [...output, log.attr, log.err]);
  }

  #log(level: LogLevel, parts: unknown[]) {
    switch (level) {
      case LogLevel.fatal:
        this.#console.error(...parts);
        break;
      case LogLevel.error:
        this.#console.error(...parts);
        break;
      case LogLevel.warn:
        this.#console.warn(...parts);
        break;
      case LogLevel.info:
        this.#console.info(...parts);
        break;
      case LogLevel.debug:
        this.#console.debug(...parts);
        break;
      case LogLevel.trace:
        this.#console.trace(...parts);
        break;
    }
  }
}

function getColor(l: LogLevel): COLOR {
  switch (l) {
    case LogLevel.fatal:
      return 'red';
    case LogLevel.error:
      return 'red';
    case LogLevel.warn:
      return 'yellow';
    case LogLevel.info:
      return 'blue';
    case LogLevel.trace:
      return 'pink';
    default:
      return 'grey';
  }
}

function applyColor(color: COLOR, message: unknown[]): unknown[] {
  const isBrowser = typeof (globalThis as unknown as Window).document === 'object';
  return isBrowser ? applyBrowserColor(color, message) : applyServerColor(color, message);
}

type COLOR = 'white' | 'red' | 'yellow' | 'blue' | 'pink' | 'grey';

function getServerColor(color: COLOR): string {
  switch (color) {
    case 'white':
      return '\x1b[37m';
    case 'red':
      return '\x1b[31m';
    case 'yellow':
      return '\x1b[33m';
    case 'blue':
      return '\x1b[36m';
    case 'pink':
      return '\x1b[35m';
    case 'grey':
      return '\x1b[90m';
  }
}

function applyServerColor(color: COLOR, message: unknown[]): unknown[] {
  return [getServerColor(color), ...message, '\x1b[0m'];
}

function applyBrowserColor(color: COLOR, message: unknown[]): unknown[] {
  const toIgnore: COLOR[] = ['red', 'yellow'];
  if (toIgnore.includes(color)) return message;

  const c = BROWSER_COLOR[color];
  return [
    `%c${message[0] ?? ''}`,
    c,
    ...message.slice(1),
  ];
}

const BROWSER_COLOR: { [key in COLOR]: string } = {
  red: '',
  yellow: '',
  blue: 'color: #4c79c4;',
  grey: 'color: #a1a1a1;',
  pink: 'color: #ff3f81;',
  white: '',
};
