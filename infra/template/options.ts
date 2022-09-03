export interface TemplateOptions {
  htmlAttributes?: Record<string, string>;
  headAttributes?: Record<string, string>;
  bodyAttributes?: Record<string, string>;
  head?: string[];
  body?: string[];
}

export type ITransformer = (options: TemplateOptions) => TemplateOptions;

export const NAME_HTML_ATTRIBUTES = '|HTML_ATTRIBUTES|';
export const NAME_HEAD_ATTRIBUTES = '|HEAD_ATTRIBUTES|';
export const NAME_BODY_ATTRIBUTES = '|BODY_ATTRIBUTES|';
export const NAME_HEAD = '|HEAD|';
export const NAME_BODY = '|BODY|';
