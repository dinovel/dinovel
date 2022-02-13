import { BaseCompiler } from "../infra/compiler.ts";
import { compileTypescript, TypescriptOptions } from "../infra/tsc.ts";
import { CompileResult } from "../models.ts";
import type { DinovelConfig } from 'dinovel/std/core/config.ts';
import { resolve } from 'deno/path/mod.ts';

export class DenoCompiler extends BaseCompiler {
  private readonly _dinovelConfig: DinovelConfig;
  public get name() { return 'deno'; }

  public constructor(config: DinovelConfig) {
    super();
    this._dinovelConfig = config;
    const denoCompileConfig = config.compilers.deno;
    if (!denoCompileConfig) { return; }
    this.setConfig(denoCompileConfig);
  }

  public async compile(files: string[]): Promise<CompileResult[]> {
    const shouldCompile = files.filter(file => file.endsWith('.ts') || file.endsWith('.js'))[0];
    if (!shouldCompile) { return []; }

    const tsOptions: TypescriptOptions = {
      input: '',
      output: '',
      config: this._dinovelConfig.deno.configFile,
      importMap: this._dinovelConfig.deno.importMap,
      unstable: true,
    };

    const results: CompileResult[] = [];

    for (const [target, source] of Object.entries(this.config.map))
    {
      tsOptions.input = source;
      tsOptions.output = resolve(this.config.output, target + '.js');
      const res = await compileTypescript(tsOptions);
      results.push({
        triggerFile: shouldCompile,
        success: res.success,
        message: res.message,
        output: res.output,
      })
    }

    return results;
  }
}
