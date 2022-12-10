import { colors } from 'https://deno.land/x/cliffy@v0.25.5/mod.ts';

export type ConsoleLogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface InternalConsole {
  error(message?: unknown, ...args: unknown[]): void;
  warn(message?: unknown, ...args: unknown[]): void;
  info(message?: unknown, ...args: unknown[]): void;
  debug(message?: unknown, ...args: unknown[]): void;
  clear(): void;
}

export interface ConsoleOptions {
  showColors: boolean;
  minLogLevel: ConsoleLogLevel;
  canClear: boolean;
  console: InternalConsole;
}

const LOG_LEVELS: Record<ConsoleLogLevel, number> = {
  error: 0,
  warn: 5,
  info: 10,
  debug: 15,
};

export class ConsoleHandler implements InternalConsole {
  #options: ConsoleOptions;
  #level: number;

  get handler() {
    return this.#options.console;
  }

  constructor(options?: Partial<ConsoleOptions>) {
    this.#options = {
      showColors: true,
      minLogLevel: 'info',
      canClear: true,
      console,
      ...options,
    };
    this.#level = LOG_LEVELS[this.#options.minLogLevel];
  }

  clear() {
    if (this.#options.canClear) {
      console.clear();
    }
  }

  public log(type: ConsoleLogLevel, message: unknown, ...args: unknown[]) {
    const level = LOG_LEVELS[type];
    if (level > this.#level) return;

    if (this.#options.showColors) {
      if (typeof message === 'string') {
        message = this.#applyColor(type, message);
      }
      for (let i = 0; i < args.length; i++) {
        const argm = args[i];
        if (typeof argm === 'string') {
          args[i] = this.#applyColor(type, argm);
        }
      }
    }

    this.handler[type](message, ...args);
  }

  error(message?: unknown, ...args: unknown[]) {
    this.log('error', message, ...args);
  }

  warn(message?: unknown, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  info(message?: unknown, ...args: unknown[]) {
    this.log('info', message, ...args);
  }

  debug(message?: unknown, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }

  #applyColor(type: ConsoleLogLevel, message: string): string {
    switch (type) {
      case 'error':
        return colors.red(message);
      case 'warn':
        return colors.yellow(message);
      case 'info':
        return colors.green(message);
      case 'debug':
        return colors.gray(message);
    }
  }
}
