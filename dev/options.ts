import { buildTemplate } from './template.ts';
import type { ConsoleLogLevel } from './infra/console-handler.ts';

/** Dinovel */
export interface DinovelConfig {
  title: string;
  port: number;
  watch: boolean;
  entry: string;
  assetsPath: string;
  indexTemplate: string;
  root: string;
  dist: string;
  useImportMap: boolean;
  importMapPath: string;
  logLevel: ConsoleLogLevel;
}

export function dinovelConfig(opt?: Partial<DinovelConfig>): DinovelConfig {
  const options: DinovelConfig = {
    title: 'Dinovel',
    root: Deno.cwd(),
    port: 8666,
    watch: true,
    entry: 'main.ts',
    assetsPath: 'assets',
    indexTemplate: '',
    dist: 'dist',
    importMapPath: './import_map.json',
    useImportMap: true,
    logLevel: 'debug',
    ...opt,
  };

  if (!options.indexTemplate) {
    options.indexTemplate = buildTemplate(options);
  }

  return options;
}
