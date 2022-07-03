import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class ServeScriptsPlugin implements Plugin {
  name = 'serve-scripts';

  inject(core: DinovelCore): void {
    const server = core.engine as Server;
    const scripts = server.scripts;

    for (const s of scripts) {
      server.router.get(`/${s.name}.js`, ctx => {
        ctx.response.body = s.src;
        ctx.response.headers.set('Content-Type', 'application/javascript');
      });
    }
  }
}
