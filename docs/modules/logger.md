# Logger

The logger module is used to log messages. It can have multiple writers that can export the messages to different
destinations, and it can have multiple formatters that are used to enrich the messages.

## LoggerFactory

The `LoggerFactory` is used to create a logger. It allow to define writers and formatters that will be used by the
logger. By default, a empty factory is registered in the [container](/modules/infra?id=container)

### How to use

```ts
// init.ts
import { container } from '$dinovel/modules/infra/mod.ts';
import { LoggerFactoryService, LogLevel, LogWriterConsole } from '$dinovel/modules/logger/mod.ts';

function init() {
  const consoleWriter = new LogWriterConsole();
  consoleWriter.setLogLevel(LogLevel.info);

  container.get(LoggerFactoryService).use(new LogWriterConsole('Dinovel'));
}

// my-module.ts
import { createLogger } from '$dinovel/modules/logger/mod.ts';

export class MyModule {
  #logger = createLogger('MyModule');

  constructor() {}

  public doSomething() {
    this.#logger.info('Doing something');
  }
}
```

### LogLevel

The log levels are used to filter the messages that will be logged. The log levels are:

- **fatal:** Used to log fatal and unrecoverable errors
- **error:** Used to log errors that won't stop the execution
- **warn:** Used to log warnings
- **info:** Used to log information
- **debug:** Used to log debug information
- **trace:** Used to log trace information, usually used to log the execution flow

### ILogWriter

The log writer is used to write the messages to a destination.

```ts
interface ILogWriter {
  write(message: ILog): void;
  setLevel(level: LogLevel): void;

  readonly level: LogLevel;
}
```

### ILogFormatter

The log formatter is used to enrich the messages.

```ts
export interface ILogFormatter {
  format: (log: ILog) => void;
}
```

## LogWriterConsole

The `LogWriterConsole` is a built in `ILogWriter` that writes the messages to the console.
