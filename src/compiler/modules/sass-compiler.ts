import { BaseCompiler } from "../infra/compiler.ts";
import { compileSass, SassOptions } from "../infra/sass.ts";
import { CompileResult } from "../models.ts";
import type { DinovelConfig } from 'dinovel/std/core/config.ts';
import { resolve } from 'deno/path/mod.ts';
import { serverEvents } from "dinovel/server/infra/events.ts";

export class SassCompiler extends BaseCompiler {
  private readonly _dinovelConfig: DinovelConfig;

  public get name() { return 'sass'; }

  public constructor(config: DinovelConfig) {
    super();
    this._dinovelConfig = config;
    const sassConfig = config.compilers.sass;
    if (!sassConfig) { return; }
    this.setConfig(sassConfig);
  }

  public async compile(trigger = ''): Promise<CompileResult[]> {
    const sassOptions: SassOptions = {
      compress: this._dinovelConfig.mode === 'dev' ? false : true,
      input: '',
      output: '',
      sourceMap: this._dinovelConfig.mode === 'dev' ? true : false,
    };

    const results: CompileResult[] = [];

    for (const [target, source] of Object.entries(this.config.map))
    {
      sassOptions.input = source;
      sassOptions.output = resolve(this.config.output, target + '.css');
      const res = await compileSass(sassOptions);
      results.push({
        triggerFile: trigger,
        success: res.success,
        message: res.message,
        output: res.output,
      })
    }

    const anyFail = results.some(res => !res.success);
    if (!anyFail) { serverEvents.emit('publicEvent', 'cssLoaded'); }

    return results;
  }

  public async compileFile(files: string[]): Promise<CompileResult[]> {
    const shouldCompile = files.filter(file => file.endsWith('.scss'))[0];
    if (!shouldCompile) { return []; }

    return await this.compile(shouldCompile);
  }
}
