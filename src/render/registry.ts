import { Definition } from './models.ts';

import type { Element } from './element.ts';

/** Web component registry */
export class WebComponentsRegistry {
  private readonly _definitions: Map<string, Definition> = new Map();
  private _hasInit = false;

  /** Initialization state */
  public get initialized(): boolean {
    return this._hasInit;
  }

  public get length(): number {
    return this._definitions.size;
  }

  public tags(): string[] {
    return Array.from(this._definitions.keys());
  }

  public list(): Definition[] {
    return Array.from(this._definitions.values());
  }

  /** Initialize the registry */
  public init(): void {
    if (this._hasInit) { return; }

    this._definitions.forEach(definition => this.defineElement(definition));

    this._hasInit = true;
  }

  /** register a new web component */
  public register(definition: Definition, overwrite = false): Promise<CustomElementConstructor> {
    if (this._definitions.has(definition.tagName)) {
      if (!overwrite) { throw new Error(`Component ${definition.tagName} already registered`); }
    }

    this._definitions.set(definition.tagName, definition);
    (definition.constructor as unknown as typeof Element).__definition__ = definition;

    if (this._hasInit) { this.defineElement(definition); }

    return customElements.whenDefined(definition.tagName);
  }

  /** Register from a collection */
  public merge(registry: WebComponentsRegistry, override = false): void {
    if (registry.initialized) { throw new Error('Cannot merge an initialized registry'); }

    registry.list().forEach(definition => this.register(definition, override));
    registry._definitions.clear();
  }

  private defineElement(definition: Definition): void {
    customElements.define(definition.tagName, definition.constructor);
  }

}
