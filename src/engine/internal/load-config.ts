import { DinovelConfig, DevServerConfig, CompilerConfig, DenoConfig } from 'dinovel/std/core/config.ts';

type CompilerMap = { [key: string]: CompilerConfig };

const defaultServerConfig: DevServerConfig = {
  assets: './dist/assets',
  static: './dist',
  host: 'localhost',
  port: 9555,
  logErrors: true,
}

const defaultRuntime: DenoConfig = {
  configFile: 'deno.jsonc',
  importMap: 'import_map.json',
  minVersion: '1.8.0',
};

const defaultCompilers: CompilerMap = {
  deno: {
    version: '1.8.0',
    watch: ['./src'],
    output: './dist/libs',
    map: {},
  },
  sass: {
    version: '1.49.0',
    watch: ['./styles'],
    output: './dist/libs',
    map: {},
  },
};

export async function loadDinovelConfiguration(path: string): Promise<[boolean, DinovelConfig]> {
  const srcFile = await readFile(path);
  return [Object.keys(srcFile).length > 0, {
    app: srcFile.app || 'Dinovel',
    version: srcFile.version || '0.1.0',
    mode: srcFile.mode || 'dev',
    server: {
      ...defaultServerConfig,
      ...(srcFile.server ?? {}),
    },
    deno: {
      ...defaultRuntime,
      ...(srcFile.deno ?? {}),
    },
    compilers: loadCompilers(srcFile.compilers ?? {}),
  }]
}

async function readFile(path: string): Promise<Partial<DinovelConfig>> {
  try {
    const fileContent = await Deno.readTextFile(path);
    return JSON.parse(fileContent);
  } catch (e) {
    console.error('Error reading config file', e);
    return {};
  }
}

function loadCompilers(source: CompilerMap): CompilerMap {
  const result: CompilerMap = {};

  for (const key in source) {
    const compiler = source[key];
    const def = defaultCompilers[key];
    if (def) {
      result[key] = {
        ...def,
        ...compiler,
      };
    } else {
      result[key] = {
        map: compiler.map ?? {},
        output: compiler.output ?? './dist/libs',
        version: compiler.version ?? '0.0.0',
        watch: compiler.watch ?? [],
      }
    }
  }

  if (!result.deno) {
    result.deno = defaultCompilers.deno;
  }

  if (!result.sass) {
    result.sass = defaultCompilers.sass;
  }

  return result;
}
