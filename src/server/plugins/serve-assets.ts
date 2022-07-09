import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';
import { send } from 'oak';

export class ServeAssetsPlugin implements Plugin {
  name = 'serve-assets';
  #location: string;

  public constructor(location?: string) {
    this.#location = location ?? `${Deno.cwd()}/assets/`;
  }

  inject(core: DinovelCore): void {
    const server = core.engine as Server;
    server.app.use(async (ctx, next) => {
      if (ctx.request.url.pathname.startsWith('/assets/')) {
        const path = ctx.request.url.pathname.replace('/assets/', '');
        await send(ctx, path, {
          root: this.#location,
        });
      }

      await next();
    });
  }
}
