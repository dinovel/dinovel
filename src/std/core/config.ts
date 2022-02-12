/** Runtime versions */
export interface RuntimeVersion {
  readonly denoVersion: string;
  readonly typescriptVersion: string;
  readonly v8Version: string;
  readonly dinovelVersion: string;
}

/** Config params for an dinovel app */
export interface DinovelConfig {
  title: string;
  port: number;
  docFolder: string;
  publicAssets: string;
  entryPoint: string;
  components: string[];
  styles: { [key: string]: string };
  production: boolean;
  localRun: boolean;
}

export interface DinovelRuntime {
  /** Runtime versions */
  readonly version: RuntimeVersion;

  /** Config params for an dinovel app */
  readonly config: DinovelConfig;
}
