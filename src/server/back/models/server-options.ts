export interface ServerOptions {
  /** Server port */
  readonly port: number;
  /** Server Front files */
  readonly front: string;
  /** import map json file */
  readonly importMap: string;
  /** Server output dir */
  readonly outDir: string;
  /** deno config file */
  readonly denoConfig: string;
  /** Styles to compile */
  readonly styles: { [key: string]: string };
  /** Scripts to compile */
  readonly sources: { [key: string]: string };
  /** Watch globs */
  readonly watch: string[];
  /** Log server errors */
  readonly logErrors: boolean;
}
