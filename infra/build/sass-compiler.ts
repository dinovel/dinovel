import { Subject } from 'rxjs';
import sass from "https://deno.land/x/denosass@1.0.4/mod.ts";
import { parse } from 'deno/path/mod.ts';

import { ICompiler } from "./compiler.ts";
import { IReporter } from "./reporter.ts";
import { BuildResult, BuildWatcher } from "./target.ts";
import { getRelativeUrl } from '../utils.ts';
import { Watcher } from '../watcher.ts';

export type SassParser = typeof sass;

export class SassCompiler implements ICompiler {
  #report: IReporter;
  #sassParser: SassParser;

  constructor(report: IReporter, sassParser?: SassParser) {
    this.#report = report;
    this.#sassParser = sassParser ?? sass;
  }

  compile(file: URL, optimize: boolean, watch?: false|undefined): Promise<BuildResult>;
  compile(file: URL, optimize: boolean, watch: true): Promise<BuildWatcher>;
  compile(file: URL , optimize: boolean, watch?: boolean): Promise<BuildResult | BuildWatcher> {
    const output = this.#compile(file, optimize);

    if (watch) {
      const dir = parse(getRelativeUrl(file, Deno.cwd())).dir;
      const subject = new Subject<BuildResult>();
      const watcher = new Watcher({
        action: () => {
          this.#report.stdout('SASS', 'changes detected');
          const result = this.#compile(file, optimize);
          subject.next(result);
        },
        extensions: ['scss'],
        paths: [dir],
      });

      watcher.start();

      return Promise.resolve({
        result: output,
        watch: subject,
        stop: () => watcher.stop(),
      });
    }

    return Promise.resolve(output);
  }

  #compile(file: URL, optimize: boolean): BuildResult {
    const path = getRelativeUrl(file, Deno.cwd());

    this.#report.stdout('SASS', `compiling ${path}...`);
    const style = this.#sassParser([path], {
      quiet: true,
      style: optimize ? 'compressed' : 'expanded',
      load_paths: [],
    }).to_string();

    if (typeof style === 'string') {
      this.#report.stdout('SASS', `compiling ${path} completed!`);
      return {
        input: file,
        success: true,
        errors: [],
        warns: [],
        output: style,
      };
    } else if (style instanceof Map) {
      for (const p of style.entries()) {
        const text = p[1];
        if (typeof text === 'string') {
          this.#report.stdout('SASS', `compiling ${path} completed!`);
          return {
            input: file,
            success: true,
            errors: [],
            warns: [],
            output: text,
          };
        }
      }
    }

    this.#report.stderr('SASS', `compiling ${path} failed!`);
    return {
      input: file,
      success: false,
      errors: ['Error compiling sass for:' + path],
      warns: [],
      output: '',
    };
  }

}
