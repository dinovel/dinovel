import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class ServeStylePlugin implements Plugin {
  name = 'serve-style';

  inject(core: DinovelCore): void {
    const server = core.engine as Server;

    server.router.get('/style.css', ctx => {
      ctx.response.body = server.styles.user;
      ctx.response.headers.set('Content-Type', 'text/css');
    });

    server.router.get('/dinovel.css', ctx => {
      ctx.response.body = server.styles.dinovel;
      ctx.response.headers.set('Content-Type', 'text/css');
    });
  }
}
