import { Command } from 'https://deno.land/x/cliffy@v0.25.5/mod.ts';
import { DinovelConfig, dinovelConfig } from '../dev/mod.ts';
import version from '../version.ts';
import { join, toFileUrl } from 'deno/path/mod.ts';

import { startDevServer } from './server.ts';

await new Command()
  .name('dinovel')
  .version(version)
  .description('Dinovel CLI')
  .globalOption('-c, --config <path:string>', 'Path to dinovel config file', { required: false })
  .command('dev', 'Starts a development server')
  .action(async (opt) => {
    const config = await buildDinovelConfig(opt.config);
    await startDevServer(config);
  })
  .parse(Deno.args);

async function buildDinovelConfig(path?: string): Promise<DinovelConfig> {
  if (!path) return dinovelConfig();

  const paths = [
    join(Deno.cwd(), '.dinovel.ts'),
    join(Deno.cwd(), '.dinovel.js'),
    join(Deno.cwd(), '.dinovel.json'),
    join(Deno.cwd(), '.dinovel'),
  ];

  if (path) {
    paths.unshift(join(Deno.cwd(), path));
  }

  const toLoad = await findPath(paths);
  if (!toLoad) return dinovelConfig();

  return dinovelConfig(await importConfig(toLoad));
}

async function findPath(paths: string[]): Promise<URL | undefined> {
  for (const path of paths) {
    try {
      await Deno.stat(path);
      return toFileUrl(path);
    } catch {
      continue;
    }
  }
}

async function importConfig(path: URL): Promise<DinovelConfig | undefined> {
  try {
    const ext = path.href.split('.').pop();

    const config = ext === 'ts' || ext === 'js'
      ? (await import(path.href)).default
      : JSON.parse(await Deno.readTextFile(path));

    if (typeof config !== 'object' || config === null) {
      throw new Error('Config is not an object');
    }

    return config;
  } catch (e) {
    console.error('Error importing dinovel config: ' + path.pathname, e);
  }
}
