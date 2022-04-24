// deno-lint-ignore-file no-explicit-any
import { createApp } from 'vue';
import type { MaybePromise } from 'dinovel/std/core/types.ts';
import type { ComponentDeclaration, DeclareComponentResult } from './declare.ts';
import type { App } from './vue-models.ts';

export type PluginRegistry = { use(...params: any[]): PluginRegistry };

/** Base render class */
export abstract class Render {
  private _targetSelector = '#app';
  private readonly _entryComponent?: DeclareComponentResult;
  private readonly _components: { [key: string]: DeclareComponentResult } = {};

  /** DOM Selector to inject app */
  public get targetSelector(): string {
    return this._targetSelector;
  }

  public constructor(entryComponent?: DeclareComponentResult) {
    this._entryComponent = entryComponent;
  }

  public declareComponent(comp: ComponentDeclaration): Render {
    if (!comp || !comp.component) { return this; }
    comp.component.__dinovel_props__ = comp;
    this._components[comp.tagName] = comp.component;
    return this;
  }

  /** Build entry component */
  protected getEntryComponent(): MaybePromise<DeclareComponentResult> {
    if (this._entryComponent) {
      return this._entryComponent;
    }

    throw new Error('Entry component not found');
  }
  /** Runs before component is built */
  protected beforeMount(): MaybePromise<void> {}
  /** Runs after app is created and mounted */
  protected afterMount(): MaybePromise<void> {}
  /** Apply any changes to root app */
  protected apply(_: App): MaybePromise<void> {}
  /** Register extra components */
  protected registerComponents(entryComponent: DeclareComponentResult): DeclareComponentResult {
    entryComponent.components = {
      ...this._components,
      ...(entryComponent.components ?? {}),
    }
    return entryComponent;
  }

  /** Set the DOM Selector to inject the app */
  protected setSelector(selector: string): void {
    this._targetSelector = selector;
  }

  /** Mount the app to the target element */
  public async mount(): Promise<void> {
    // Run beforeMount actions
    await this.beforeMount();
    // Build entry component
    const entryComponent = await this.getEntryComponent();
    // Register extra components
    this.registerComponents(entryComponent);
    // Create vue app
    const app = createApp(entryComponent);
    // Register plugins
    await this.apply(app);
    // Mount app
    app.mount(this.targetSelector);
    // Run afterMount actions
    await this.afterMount();
  }
}
