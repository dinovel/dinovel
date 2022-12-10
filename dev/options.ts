import { buildTemplate } from './template.ts';
import type { ConsoleLogLevel } from './infra/console-handler.ts';

/** Dinovel configuration */
export interface DinovelConfig {
  /** Title of the game */
  title: string;
  /**
   * Port to run the development server on
   * @default 8666
   */
  port: number;
  /**
   * Whether to watch for file changes
   * @default true
   */
  watch: boolean;
  /**
   * Entry file, relative to root
   * @default './main.ts'
   */
  entry: string;
  /**
   * Path to assets folder, relative to root
   * @default './assets'
   */
  assetsPath: string;
  /**
   * Html template to use for the index page
   */
  indexTemplate: string;
  /**
   * Root directory of the project
   * @default Deno.cwd()
   */
  root: string;
  /**
   * Path to folder where the build should be output
   * @default './dist'
   */
  dist: string;
  /**
   * Whether to use an import map
   * @default true
   */
  useImportMap: boolean;
  /**
   * Path to import map file
   * @default './import_map.json'
   */
  importMapPath: string;
  /**
   * Log level, one of 'debug', 'info', 'warn', 'error'
   * @default 'debug'
   */
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
