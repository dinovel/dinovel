import sass from "https://deno.land/x/denosass@1.0.4/mod.ts";
import { SassBundlerOptions } from './models.ts';

export class SassBundler {
  #opt: SassBundlerOptions;

  constructor(options: SassBundlerOptions) {
    this.#opt = options;
  }

  public bundle(entry: string) {
    return sass([entry], {
      load_paths: [],
      quiet: this.#opt.quiet,
      style: this.#opt.style,
    })
  }
}
