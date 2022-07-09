import { StoreModules, Module, StoreState, StorePlugin, Action } from './models.ts';
import { Observable } from 'rxjs';

/**
 * Store state
 *
 * Can be saved and loaded from a JSON file.
 * Stores can be subscribed to to get notified when the state changes.
 */
export class Store<T extends StoreState> {
  readonly #modules: StoreModules<T>;
  readonly #plugins: Map<string, StorePlugin<T>> = new Map();

  public get modulesName(): string[] {
    return Object.keys(this.#modules);
  }

  public constructor(modules: StoreModules<T>) {
    this.#modules = modules;
  }

  /**
   * Get a module by name
   * If the module does not exist, an exception is thrown.
   *
   * @param name Name of the module to get
   * @returns Module for the given name
   */
  public module<K extends keyof T>(name: K): Module<T[K]> {
    const mod = this.#modules[name];
    if (!mod) throw new Error(`Module ${String(name)} does not exist`);
    return mod;
  }

  /**
   * Get a module state by name
   * If the module does not exist, an exception is thrown.
   *
   * @param name Name of the module to get
   * @returns The state of the module
   */
  public state<K extends keyof T>(name: K): Observable<T[K]> {
    return this.#modules[name].state;
  }

  /**
   * Creates a new Store with new modules
   *
   * @param modules Modules to merge to the store
   * @param override If true, existing modules will be overridden
   * @returns
   */
  public merge<K extends StoreState>(modules: StoreModules<K>, override = false): Store<T & K> {
    const mods = override
      ? { ...this.#modules, ...modules, }
      : { ...modules, ...this.#modules, };

    const store = new Store(mods as unknown as StoreModules<T & K>);
    for (const plugin of this.#plugins.values()) {
      store.addPlugin(plugin as unknown as StorePlugin<T & K>);
    }
    return store;
  }

  /**
   * Dispatch an action to all store modules
   *
   * @param action Action to be applied to the store
   * @returns True, if the action was applied to at least one module
   */
  public dispatch(action: Action): boolean {
    const modList = Object.keys(this.#modules);
    this.callPlugins(p => p.action?.call(p, action));
    let wasUsed = false;
    for (const modKey of modList) {
      wasUsed = this.#modules[modKey].apply(action);
    }
    return wasUsed;
  }

  /**
   * Serialize the store to a JSON object and stringify it
   *
   * @returns Serialized state for all modules
   */
  public export(): string {
    const obj: Record<string, unknown> = {};
    for (const modKey of Object.keys(this.#modules)) {
      obj[modKey] = this.#modules[modKey].currentState;
    }
    this.callPlugins(p => p.export?.call(p, obj));
    return JSON.stringify(obj);
  }

  /**
   * Deserialize the store from a JSON string and load it
   *
   * @param str Serialized state for all modules
   */
  public import(str: string): void {
    const obj = JSON.parse(str) as Record<string, unknown>;
    this.callPlugins(p => p.import?.call(p, obj));
    for (const modKey of Object.keys(this.#modules)) {
      if (!this.#modules[modKey]) {
        console.error(`Import Error: Module ${modKey} does not exist`);
        continue;
      }

      this.#modules[modKey].reset(obj[modKey] as T[string]);
    }
  }

  /**
   * Add a new plugin to the store
   *
   * @param plugin plugin to inject
   */
  public addPlugin(plugin: StorePlugin<T>): void {
    this.#plugins.set(plugin.id, plugin);
    plugin.init?.call(plugin, this);
  }

  /** Remove plugin from store */
  public removePlugin(id: string): void {
    this.#plugins.delete(id);
  }

  private callPlugins(apply: (p: StorePlugin<T>) => void): void {
    for (const plugin of this.#plugins.values()) {
      apply(plugin);
    }
  }
}
