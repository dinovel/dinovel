import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { DenoCompiler, SassCompiler } from 'dinovel/compiler/modules/__.ts';
import { Server } from 'dinovel/server/server.ts';
import { serverEvents } from 'dinovel/server/infra/events.ts';
import type { DinovelConfig } from 'dinovel/std/core/config.ts'
import { CompileResult, Compiler } from "dinovel/compiler/models.ts";

export async function startDevServer(): Promise<number> {
  try {
    const config = Dinovel.runtime.config;

    listenForEvents();
    await initCompilers(config);

    const server = new Server(config.server);
    return server.start();
  } catch (err) {
    Dinovel.logger.error('Server error:', err);
    return 1;
  }
}

function listenForEvents() {
  serverEvents.on('exception', err => { Dinovel.logger.error('Server internal error:', err.message); });
  serverEvents.on('serverStart', _ => { showServerMessage(); });
  serverEvents.on('serverError', err => {
    const ignore = !err.context || !!err.context.matched.find(e => e.path === '/sse');
    if (ignore) { return; }
    Dinovel.logger.error('Server error:', JSON.stringify(err.context ?? {}));
  });
}

async function initCompilers(config: DinovelConfig) {
  Dinovel.compilers.set(new DenoCompiler(config));
  Dinovel.compilers.set(new SassCompiler(config));
  Dinovel.compilers.startWatchers();
  for (const c of Dinovel.compilers.getAll()) {
    Dinovel.logger.info(`Compiler ${c.name} started`);
    await removeTarget(c);
    c.fileChanged.subscribe({ next: fileChanged });
    c.errors.subscribe({ next: err => Dinovel.logger.error(`Compiler error: ${err}`) });
    c.compileResults.subscribe({ next: onCompile });
    const res = await c.compile();
    res.forEach(e => onCompile(e, false));
  }
}

function fileChanged(file: string[]) {
  Dinovel.logger.engine('File changed:');
  for (const f of file) {
    Dinovel.logger.engine('  ', f);
  }
}

function onCompile(res: CompileResult, final = true): void {
  Dinovel.logger.info(`Compile result: ${res.triggerFile}`);
  Dinovel.logger.info(`  - success: ${res.success}`);
  Dinovel.logger.info(`  - message: ${res.message}`);
  Dinovel.logger.info(`  - output: ${res.output}`, { $assert: !res.output });
  if (final) { showServerMessage(!res.success); }
}

async function removeTarget(c: Compiler) {
  const names = Object.keys(c.config.map);
  for (const n of names) {
    const path = `${c.config.output}/${n}`;
    try { await Deno.remove(path); } catch { /* ignore */ }
  }
}

function showServerMessage(fail = false) {
  if (!fail) { console.clear(); }
  const port = Dinovel.runtime.config.server.port;
  Dinovel.logger.engine(`Server started:`);
  Dinovel.logger.engine(`  - url: http://localhost:${port}`);
}
