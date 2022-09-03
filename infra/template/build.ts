import { DEFAULT_TEMPLATE } from "./defaultTemplate.ts";
import { ITransformer, TemplateOptions } from "./options.ts";

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
      .replace("|HTML_ATTRIBUTES|", this.#buildAttributes(this.#options.htmlAttributes))
      .replace("|HEAD_ATTRIBUTES|", this.#buildAttributes(this.#options.headAttributes))
      .replace("|BODY_ATTRIBUTES|", this.#buildAttributes(this.#options.bodyAttributes))
      .replace("|HEAD|", this.#buildContent(this.#options.head))
      .replace("|BODY|", this.#buildContent(this.#options.body));
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
