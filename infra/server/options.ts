import { BuildTargets } from '../build/mod.ts';
import { ITransformer, TemplateOptions } from '../template/mod.ts';

export interface ServerOptions {
  port?: number;
  targets: BuildTargets;
  templateOptions?: TemplateOptions;
  transformers?: ITransformer[];
  assetsFolder?: string;
  title?: string;
}
