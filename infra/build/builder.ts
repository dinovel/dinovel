import type { LoggerService } from 'dinovel/std/logger.ts';
import { BuildTargets, BuildWatchers, BuildTarget, BuildResult, TargetType, BuildResults } from "./target.ts";
import { ICompiler } from './compiler.ts';
import { IListner, IReporter } from "./reporter.ts";
import { SassCompiler } from './sass-compiler.ts';
import { EsbuildCompiler  } from './esbuild-compiler.ts';
import { buildUrl, getUniqueName } from "../utils.ts";

export class DinovelBuilder {
  #targets: BuildTargets = {};
  #compiler: { [key in TargetType]: ICompiler };
  #output: Record<string, string> = {};
  #watchers: BuildWatchers = {};
  #running = false;

  constructor(
    logger: LoggerService,
    stylesCompiler?: ICompiler,
    scriptCompiler?: ICompiler,
  ) {

    const reporter: IReporter = {
      stderr(src: string, message: string) {
        logger.error(message, src);
      },
      stdout(src: string, message: string) {
        logger.info(message, src);
      },
    };

    this.#compiler = {
      style: stylesCompiler ?? new SassCompiler(reporter),
      script: scriptCompiler ?? new EsbuildCompiler(reporter),
    };
  }

  public stop(): void {
    if (!this.#running) return;
    Object.values(this.#watchers).forEach((watcher) => watcher.stop());
    this.#watchers = {};
    this.#output = {};
    this.#running = false;
  }

  public addTargets(targets: BuildTargets): void {
    if (this.#running) {
      throw new Error('Cannot add targets while builder is running');
    }
    this.#targets = { ...this.#targets, ...targets };
  }

  public addScript(path: string, name?: string, optimize = false): string {
    const resultName = name ?? getUniqueName('script');
    this.addTargets({
      [resultName]: {
        input: buildUrl(path),
        type: 'script',
        optimize,
      },
    });
    return resultName;
  }

  public addStyle(path: string, name?: string, optimize = false): string {
    const resultName = name ?? getUniqueName('style');
    this.addTargets({
      [resultName]: {
        input: buildUrl(path),
        type: 'style',
        optimize,
      },
    });
    return resultName;
  }

  public getOutput(name: string): string | undefined {
    return this.#output[name];
  }

  public async build(watch = false, lst: IListner = {}): Promise<BuildResults> {
    if (this.#running) {
      throw new Error('Cannot build while builder is running');
    }
    this.#running = true;
    const results: BuildResults = {};
    let current = 0;
    const total = Object.keys(this.#targets).length;

    for (const [name, target] of Object.entries(this.#targets)) {
      lst.progress?.onProgress(current, total, 'Building...', name);
      const res = watch
        ? await this.#watch(name, target, lst)
        : await this.#build(name, target, lst);
      lst.progress?.onProgress(current, total, 'Building completed!', name);

      results[name] = res;
      current++;
    }
    lst.progress?.onProgress(current, total, 'All build completed!');
    lst.progress?.onCompleted();

    this.#running = watch;
    return results;
  }

  async #build(name: string, target: BuildTarget, lst: IListner): Promise<BuildResult> {
    const res = await this.#compiler[target.type].compile(target.input, target.optimize);
    this.#output[name] = res.output;
    lst.build?.(name, res);
    return res;
  }

  async #watch(name: string, target: BuildTarget, lst: IListner): Promise<BuildResult> {
    const watcher = await this.#compiler[target.type].compile(target.input, target.optimize, true);
    this.#output[name] = watcher.result.output;
    lst.build?.(name, watcher.result);
    watcher.watch.subscribe((res) => {
      this.#output[name] = res.output;
      lst.build?.(name, res);
    });
    return watcher.result;
  }
}
