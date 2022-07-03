import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class ServeStylePlugin implements Plugin {
  name = 'serve-style';

  inject(core: DinovelCore): void {
    const server = core.engine as Server;

    server.router.get('/style.css', ctx => {
      ctx.response.body = server.style;
      ctx.response.headers.set('Content-Type', 'text/css');
    });
  }
}
