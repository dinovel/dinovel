import type { CompilerConfig } from 'dinovel/std/core/config.ts';
import type { IObservable } from 'dinovel/std/reactive/__.ts';

export interface CompileResult {
  triggerFile: string;
  success: boolean;
  message: string;
  output: string;
}

export interface Compiler {
  /** key name */
  readonly name: string;
  /** Set compiler configuration */
  setConfig(config: CompilerConfig): void;
  /** Start watching for file changes */
  startWatch(): Promise<void>;

  /** Observable for compile results */
  readonly compileResults: IObservable<CompileResult>;
  /** Observable for file changes */
  readonly fileChanged: IObservable<string[]>;
  /** Observable for errors */
  readonly errors: IObservable<unknown>;
}
