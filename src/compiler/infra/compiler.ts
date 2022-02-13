import type { CompilerConfig } from 'dinovel/std/core/config.ts';
import type { CompileResult, Compiler } from '../models.ts';
import { IObservable, Subject, debounce } from 'dinovel/std/reactive/__.ts';
import { expandGlobSync } from 'deno/fs/mod.ts';
import { resolve } from 'deno/path/mod.ts';

export abstract class BaseCompiler implements Compiler {
  private __config?: CompilerConfig;
  private __isWaching = false;

  protected _compileResults = new Subject<CompileResult>();
  protected _fileChanged = new Subject<string[]>();
  protected _errors = new Subject<unknown>();

  public get config(): CompilerConfig {
    if (!this.__config) {
      throw new Error('Compiler config not set');
    }
    return this.__config;
  }

  public get compileResults(): IObservable<CompileResult> {
    return this._compileResults;
  }

  public get fileChanged(): IObservable<string[]> {
    return this._fileChanged;
  }

  public get errors(): IObservable<unknown> {
    return this._errors;
  }

  public abstract get name(): string;

  public setConfig(config: CompilerConfig): void {
    this.__config = config;
  }

  public async startWatch(): Promise<void> {
    const paths = this.loadWatchPaths();
    if (!paths.length || this.__isWaching) { return; }
    this.__isWaching = true;

    try {
      const internalSubject = new Subject<string[]>();
      internalSubject
        .pipe(debounce(300))
        .subscribe({ next: this.processFileChanged });

      const watcher = Deno.watchFs(paths);
      for await (const event of watcher) {
        internalSubject.next(event.paths);
      }
    } catch (error) {
      this.__isWaching = false;
      this._errors.next(error);
    }
  }

  protected abstract compile(files: string[]): Promise<CompileResult[]>;

  private async processFileChanged(paths: string[]): Promise<void> {
    const cleanPaths: string[] = [];

    for (const path of paths) {
      cleanPaths.push(resolve(path));
    }

    this._fileChanged.next(cleanPaths);
    const result = await this.compile(cleanPaths);
    result.forEach(res => this._compileResults.next(res));
  }

  private loadWatchPaths(): string[] {
    const paths = this.config.watch;
    const fullPaths: string[] = [];

    for (const path of paths) {
      if (path.indexOf('*') === -1) {
        fullPaths.push(path);
        continue;
      }

      for (const file of expandGlobSync(path, { includeDirs: true })) {
        if (file.isDirectory) {
          fullPaths.push(file.path);
        }
      }
    }

    return fullPaths;
  }

}
