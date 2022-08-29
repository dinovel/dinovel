import type { Observable } from "rxjs";

export type TargetType = 'style' | 'script';

export interface BuildTarget {
  input: URL;
  type: TargetType;
  optimize: boolean;
}

export interface BuildResult {
  input: URL;
  output: string;
  success: boolean;
  warns: string[];
  errors: string[];
}

export interface BuildWatcher {
  result: BuildResult;
  watch: Observable<BuildResult>;
  stop(): void;
}

export type BuildTargets = Record<string, BuildTarget>;

export type BuildWatchers = Record<string, BuildWatcher>;
