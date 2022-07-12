import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.5.0/mod.ts";
import { initialize, build, BuildResult } from "https://deno.land/x/esbuild@v0.14.48/mod.js";
import { parse } from 'deno/path/mod.ts';
import type { ESBundlerOptions } from './models.ts';

export type { BuildResult, BuildFailure, OutputFile } from "https://deno.land/x/esbuild@v0.14.48/mod.js";

export class ESBundler {
  #opt: ESBundlerOptions;
  #cwd: string;
  #hasInit = false;

  public get options(): ESBundlerOptions {
    return this.#opt;
  }

  public get cwd(): string {
    return this.#cwd;
  }

  constructor(options: ESBundlerOptions) {
    this.#opt = options;
    this.#cwd = Deno.cwd();
  }

  public async bundle(entry: string): Promise<BuildResult>
  public async bundle(entry: URL): Promise<BuildResult>
  public async bundle(entry: string | URL): Promise<BuildResult> {
    const entryPath = typeof entry === 'string'
      ? new URL(entry, this.#opt.root).href
      : entry.href;
    const name = parse(entryPath).name;

    if (!this.#hasInit) {
      await initialize({});
      this.#hasInit = true;
    }

    return await build({
      entryPoints: { [name]: entryPath },
      bundle: true,
      format: "esm",
      metafile: true,
      minify: this.#opt.minify,
      outdir: ".",
      absWorkingDir: this.#cwd,
      outfile: "",
      platform: "neutral",
      plugins: [denoPlugin({
        importMapURL: this.#opt.importMapURL,
        // deno-lint-ignore no-explicit-any
      }) as any],
      splitting: false,
      target: ["chrome99", "firefox99", "safari15"],
      treeShaking: this.#opt.treeShaking,
      write: false,
      define: this.#opt.define,
      incremental: this.#opt.incremental,
      charset: 'utf8',
      banner: { js: this.#opt.banner ?? "" },
      drop: this.#opt.drop,
      keepNames: this.#opt.keepNames,
      logLevel: this.#opt.logLevel,
      logLimit: this.#opt.logLimit,
      sourceRoot: this.#opt.sourceRoot,
      sourcemap: this.#opt.sourceMap,
      watch: this.#opt.watch,
    });
  }
}
