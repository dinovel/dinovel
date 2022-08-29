import { BuildWatcher, BuildResult } from "./target.ts";

export interface ICompiler {
  compile(file: URL, optimize: boolean, watch?: false): Promise<BuildResult>;
  compile(file: URL, optimize: boolean, watch: true): Promise<BuildWatcher>;
}
