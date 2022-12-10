import { FileTranspiler, TranspileOptions, TranspileResult } from './models.ts';
import { Watcher } from '../infra/watcher.ts';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ESBuildTranspiler } from './esbuild.ts';

export interface TranspilerWatchResult {
  readonly results: Observable<TranspileResult>;
  readonly changes: Observable<string[]>;
  readonly lastResult: TranspileResult;
  stop: () => void;
}

export class Transpiler {
  #transpiler: FileTranspiler;
  #options: TranspileOptions;

  constructor(transpiler: FileTranspiler, options: TranspileOptions) {
    this.#transpiler = transpiler;
    this.#options = options;
  }

  public async transpile(): Promise<TranspileResult> {
    try {
      return await this.#transpiler.transpile(this.#options);
    } catch (e) {
      return {
        success: false,
        diagnostics: [
          {
            type: 'error',
            message: e.message,
          },
        ],
        target: this.#options.target,
        extra: e,
      };
    }
  }

  public async watch(paths: string[], extensions: string[]): Promise<TranspilerWatchResult> {
    const initial = await this.transpile();
    const results = new BehaviorSubject<TranspileResult>(initial);
    const changes = new Subject<string[]>();

    const watcher = new Watcher({
      paths,
      extensions,
      action: async (files) => {
        changes.next(files);
        const res = await this.transpile();
        results.next(res);
      },
    });
    watcher.start();

    return {
      results,
      changes,
      stop: () => watcher.stop(),
      get lastResult() {
        return results.value;
      },
    };
  }

  /** Creates a transpiler instance that uses ESBuild */
  public static createESBuild(opt: TranspileOptions): Transpiler {
    return new Transpiler(
      new ESBuildTranspiler(),
      opt,
    );
  }
}
