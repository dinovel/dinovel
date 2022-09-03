import type { BuildResult } from "./target.ts";

export interface IReporter {
  stdout(src: string, message: string): void;
  stderr(src: string, message: string): void;
}

export interface IProgressListner {
  onProgress(current: number, total: number, message: string, target?: string): void;
  onCompleted(): void;
}

export type IBuildListner = (name: string, result: BuildResult) => void;

export interface IListner {
  progress?: IProgressListner;
  build?: IBuildListner;
}
