import { Application, Router, send } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { DinovelConfig } from './options.ts';
import { InternalConsole } from './infra/console-handler.ts';
import { Transpiler, TranspilerWatchResult } from './transpiler/mod.ts';
import { LIVE_RELOAD_SCRIPT } from './template.ts';
import { DEFAULT_ENDPOINT } from './live-reload/mod.ts';
import { parse } from 'deno/path/mod.ts';

export interface DevServer {
  start(): Promise<number>;
  stop(): void;
}

export class DinovelServer implements DevServer {
  #config: DinovelConfig;
  #console: InternalConsole;
  #transpiler: Transpiler;
  #controler?: AbortController;
  #watcher?: TranspilerWatchResult;
  #reloadSockets: WebSocket[] = [];
  #mainScript?: string;

  constructor(
    config: DinovelConfig,
    console: InternalConsole,
    transpiler: Transpiler,
  ) {
    this.#config = config;
    this.#console = console;
    this.#transpiler = transpiler;
  }

  async start(force = false): Promise<number> {
    this.#console.debug('Starting server...');
    if (this.#controler && !force) {
      this.#console.warn('Server already running.');
      return 5;
    }

    this.#controler?.abort();
    this.#controler = new AbortController();

    const app = new Application();
    const router = new Router();

    this.#console.debug('Compiling...');
    await this.#registerMainScript(router);
    this.#console.debug('Compiling Done');

    this.#registerTemplateRoute(router);
    this.#registerAbortRoute(router);
    this.#registerLiveReload(router);

    this.#registerAssets(app);

    app.use(router.routes());
    app.use(router.allowedMethods());

    try {
      console.debug('Server started.');
      await app.listen({
        port: this.#config.port,
        signal: this.#controler.signal,
        secure: false,
        hostname: '0.0.0.0',
      });
      return 0;
    } catch (err) {
      this.#console.error(err);
      return 1;
    }
  }

  stop(): void {
    this.#reloadSockets.forEach((socket) => {
      try {
        socket.close();
      } catch { /* ignore */ }
    });
    this.#watcher?.stop();
    this.#controler?.abort();

    this.#reloadSockets = [];
  }

  #registerTemplateRoute(router: Router): void {
    router.get('/', (ctx) => {
      ctx.response.body = this.#config.indexTemplate;
      ctx.response.headers.set('Content-Type', 'text/html');
    });

    router.get('/index.html', (ctx) => {
      ctx.response.body = this.#config.indexTemplate;
      ctx.response.headers.set('Content-Type', 'text/html');
    });
  }

  #registerAbortRoute(router: Router): void {
    router.get('/abort', (ctx) => {
      this.stop();
      ctx.response.body = 'OK';
    });
  }

  #registerAssets(app: Application) {
    app.use(async (ctx, next) => {
      if (ctx.request.url.pathname.startsWith('/assets/')) {
        const path = ctx.request.url.pathname.replace('/assets/', '');
        await send(ctx, path, {
          root: this.#config.assetsPath,
        });
      }

      await next();
    });
  }

  #registerLiveReload(router: Router): void {
    const base = import.meta.url.replace('server.ts', 'lib/live-reload.js');
    const fileContent = Deno.readTextFileSync(new URL(base));

    router.get(LIVE_RELOAD_SCRIPT, (ctx) => {
      ctx.response.body = fileContent;
      ctx.response.headers.set('Content-Type', 'application/javascript');
    });

    router.get(DEFAULT_ENDPOINT, (ctx) => {
      if (!ctx.isUpgradable) {
        ctx.throw(501);
      }

      this.#reloadSockets.push(ctx.upgrade());
    });
  }

  async #registerMainScript(router: Router) {
    if (this.#watcher) {
      this.#watcher.stop();
    }

    this.#watcher = await this.#transpiler.watch(
      [parse(this.#config.entry).dir],
      ['ts', 'tsx', 'js', 'jsx'],
    );

    this.#watcher.results.subscribe((result) => {
      if (result.success) {
        this.#mainScript = result.output;
        this.#reloadSockets.forEach((socket) => {
          socket.send('{ type: "reload" }');
        });
      }
    });

    router.get('/main.js', (ctx) => {
      const result = this.#mainScript ?? 'alert("No main script found")';

      ctx.response.body = result;
      ctx.response.headers.set('Content-Type', 'application/javascript');
    });
  }
}
