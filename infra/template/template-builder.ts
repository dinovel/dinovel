import { DEFAULT_TEMPLATE } from "./defaultTemplate.ts";
import { ITransformer, TemplateOptions, NAME_BODY, NAME_BODY_ATTRIBUTES, NAME_HEAD, NAME_HEAD_ATTRIBUTES, NAME_HTML_ATTRIBUTES } from "./options.ts";

export class TemplateBuilder {
  #template: string;
  #options: TemplateOptions = {};

  constructor(template?: string) {
    this.#template = template ?? DEFAULT_TEMPLATE;
  }

  public setOptions(options: TemplateOptions): this {
    this.#options = options;
    return this;
  }

  public apply(...transformers: ITransformer[]): this {
    for (const transformer of transformers) {
      this.#options = transformer(this.#options);
    }
    return this;
  }

  public build(): string {
    return this.#template
      .replace(NAME_HTML_ATTRIBUTES, this.#buildAttributes(this.#options.htmlAttributes))
      .replace(NAME_HEAD_ATTRIBUTES, this.#buildAttributes(this.#options.headAttributes))
      .replace(NAME_BODY_ATTRIBUTES, this.#buildAttributes(this.#options.bodyAttributes))
      .replace(NAME_HEAD, this.#buildContent(this.#options.head))
      .replace(NAME_BODY, this.#buildContent(this.#options.body));
  }

  #buildAttributes(attributes?: Record<string, string>): string {
    if (!attributes) return "";
    return Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  }

  #buildContent(content?: string[]): string {
    if (!content) return "";
    return content.join("\n  ");
  }

  public static create(template?: string): TemplateBuilder {
    return new TemplateBuilder(template);
  }
}
