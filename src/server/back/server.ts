import { resolve } from 'deno/path/mod.ts';
import { Application } from 'oak';

import { registerHandlers } from './handlers/__.ts';
import { serverEvents } from './infra/events.ts';
import { startWatcher } from './infra/watcher.ts';
import { registerMiddleware } from './middleware/__.ts';
import { ServerOptions } from './models/server-options.ts';

export class Server {
  private readonly _options: ServerOptions;
  private readonly _middleware: ((app: Application) => void)[] = [];
  private _controller?: AbortController;
  private _hasStarted = false;

  public get options(): ServerOptions {
    return this._options;
  }

  constructor(options: ServerOptions) {
    this._options = {
      ...options,
      front: resolve(options.front),
    }
  }

  public use(middleware: (app: Application) => void): void {
    this._middleware.unshift(middleware);
  }

  public async start(): Promise<number> {
    if (this._hasStarted) { return 0; }
    const app = this.buildApp();
    this._controller = new AbortController();

    app.use((ctx) => {
      ctx.response.body = "Hello World!";
    });

    try {
      registerHandlers(this._options);
      startWatcher(this._options.watch);
      this._hasStarted = true;
      await app.listen({
        port: this._options.port,
        signal: this._controller.signal,
      });
      return 0;
    } catch (error) {
      console.error(error);
      return 1;
    }
  }

  public stop(): void {
    if (!this._hasStarted) { return; }
    this._controller?.abort();
    this._hasStarted = false;
  }

  private buildApp(): Application {
    const app = new Application({
      logErrors: this._options.logErrors,
    });

    this.registerGlobalEvents(app);

    this._middleware.forEach((middleware) => {
      middleware(app);
    });

    registerMiddleware(app, this._options);

    return app;
  }

  private registerGlobalEvents(app: Application): void {
    app.addEventListener('error', (event: unknown) => {
      serverEvents.emit('serverError', event as ErrorEvent);
    });

    app.addEventListener('listen', () => {
      serverEvents.emit('serverStart', this._options.port);
      serverEvents.emit('publicEvent', 'ready');
    });
  }
}
