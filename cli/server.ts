import { ConsoleHandler, DinovelConfig, DinovelServer, Transpiler } from '../dev/mod.ts';
import { join, toFileUrl } from 'deno/path/mod.ts';

export async function startDevServer(config: DinovelConfig): Promise<number> {
  const internalConsole = new ConsoleHandler({
    minLogLevel: config.logLevel,
    canClear: true,
    showColors: true,
  });

  const transpiler = Transpiler.createESBuild({
    optimize: false,
    importMapURL: toFileUrl(join(config.root, config.importMapPath)),
    target: toFileUrl(join(config.root, config.entry)),
    useImportMap: config.useImportMap,
  });

  const server = new DinovelServer(config, internalConsole, transpiler);
  return await server.start();
}
