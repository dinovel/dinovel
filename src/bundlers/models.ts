import type { Drop, LogLevel, WatchMode } from "https://deno.land/x/esbuild@v0.14.48/mod.js";

export interface ESBundlerOptions {
  root: string;
  minify: boolean;
  treeShaking: boolean;
  incremental: boolean;
  banner: string;
  drop: Drop[];
  keepNames: boolean;
  logLevel: LogLevel;
  logLimit: number;

  watch?: WatchMode | boolean;
  importMapURL?: URL;
  define?: { [key: string]: string };
  sourceRoot?: string;
  sourceMap?: 'inline';
}

export interface SassBundlerOptions {
  style: 'expanded' | 'compressed';
  quiet: boolean;
}
