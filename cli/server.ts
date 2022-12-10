import { ConsoleHandler, DinovelConfig, DinovelServer, Transpiler } from '../dev/mod.ts';

export async function startDevServer(config: DinovelConfig): Promise<number> {
  const internalConsole = new ConsoleHandler({
    minLogLevel: config.logLevel,
    canClear: true,
    showColors: true,
  });

  const transpiler = Transpiler.createESBuild({
    optimize: false,
    importMapURL: new URL(config.importMapPath, Deno.cwd()),
    target: new URL(config.entry, Deno.cwd()),
    useImportMap: config.useImportMap,
  });

  const server = new DinovelServer(config, internalConsole, transpiler);
  return await server.start();
}
