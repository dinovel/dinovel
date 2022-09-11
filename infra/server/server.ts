import { ServerOptions } from './options.ts';
import { LiveServer } from './live-server.ts';
import { registerEvents } from './events.ts';
import { registerDinovelBuilder, registerIndex } from './builders.ts';
import { registerAssets } from './assets.ts';
import { Application, Router } from "oak";
import { LoggerService } from "dinovel/std/logger.ts";

export function runServer(options: ServerOptions): LiveServer {
  const { port = 8666, targets, assetsFolder = 'assets' } = options;

  const logger = new LoggerService();
  const app = new Application();
  const router = new Router();
  const controler = new AbortController();

  const events = registerEvents(router);
  const builder = registerDinovelBuilder(router, targets, logger);
  registerIndex(router, options);
  registerAssets(app, assetsFolder);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return {
    port,
    start: async () => {
      await builder.build(true, {
        build: (name, res) => {
          if (!res.success) { return; }
          events.emit('reload', targets[name].type);
        }
      })

      try {
        await app.listen({ port, signal: controler.signal });
        return 0;
      } catch (e) {
        if (e instanceof Deno.errors.AddrInUse) {
          console.error(`Port ${port} is already in use`);
          return 1;
        } else {
          return 2;
        }
      }
    },
    stop: () => {
      builder.stop();
      events.emit('stop', '');
      controler.abort();
      return Promise.resolve();
    }
  };
}
