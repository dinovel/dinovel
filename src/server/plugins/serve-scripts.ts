import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';

export class ServeScriptsPlugin implements Plugin {
  name = 'serve-scripts';

  inject(core: DinovelCore): void {
    const server = core.engine as Server;
    const scripts = server.scripts;

    for (const [name, _] of scripts.entries()) {
      server.router.get(`/${name}.mjs`, ctx => {
        ctx.response.body = scripts.get(name);
        ctx.response.headers.set('Content-Type', 'application/javascript');
      });
    }
  }
}
