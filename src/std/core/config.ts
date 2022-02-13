/** Runtime versions */
export interface RuntimeVersion {
  readonly denoVersion: string;
  readonly typescriptVersion: string;
  readonly v8Version: string;
  readonly dinovelVersion: string;
}

/** Deno runtime configuration */
export interface DenoConfig {
  /** import map json file, defaults to 'import_map.json' */
  readonly importMap: string;
  /** Deno config json file, defaults to deno.jsonc */
  readonly configFile: string;
  /** Min allowed version of deno, cannot be lower that dinovel internal version */
  readonly minVersion: string;
}

/** Development server configuration */
export interface DevServerConfig {
  /** Port to listen on, defaults to 9555 */
  readonly port: number;
  /** Host to listen on, defaults to 'localhost' */
  readonly host: string;
  /** Path to serve static files, defaults to './dist' */
  readonly static: string;
  /** Game assets folder */
  readonly assets: string;
  /** If true, log internal server errors */
  readonly logErrors: boolean;
}

/** Configuration for file compiler */
export interface CompilerConfig {
  /** Min version to use */
  readonly version: string;
  /** Files or folders to watch */
  readonly watch: string[];
  /** Folder to output */
  readonly output: string;
  /** Entries to compile */
  readonly map: { [key: string]: string };
}

/** Config params for an dinovel app */
export interface DinovelConfig {
  /** Application name */
  readonly app: string;
  /** Application version */
  readonly version: string;
  /** Bundle mode */
  readonly mode: 'dev' | 'prod';
  /** Deno runtime configuration */
  readonly deno: DenoConfig;
  /** Development server configuration */
  readonly server: DevServerConfig;
  /** Compilers configuration */
  readonly compilers: { [key: string]: CompilerConfig };
  /** Runtime plugins to load */
  readonly plugins?: string[];
}

export interface DinovelRuntime {
  /** Runtime versions */
  readonly version: RuntimeVersion;

  /** Config params for an dinovel app */
  readonly config: DinovelConfig;
}
