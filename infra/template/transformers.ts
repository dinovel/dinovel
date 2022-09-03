import type { ITransformer, TemplateOptions } from './options.ts';
import * as formatters from './formartters.ts';

type ArrayKeys = keyof Pick<TemplateOptions, 'head' | 'body'>;

function build(target: ArrayKeys ,values: string[]): ITransformer {
  return (options) => {
    options[target] = [...options.head ?? [], ...values];
    return options;
  };
}

export const title = (v: string) => build('head', [`<title>${v}</title>`]);
export const css = (v: string[]) => build('head', formatters.css(v));
export const js = (v: string[]) => build('body', formatters.js(v));
export const defaultHeader = () => build('head', [
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
]);
