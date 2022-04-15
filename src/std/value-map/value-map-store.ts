import { IValueMap, ValueMap } from "./models.ts";
import { DEFAULT_MAPS } from "./default-maps.ts";
import { Keys } from '../core/types.ts';

export class ValueMapStore<T extends ValueMap> {
  private readonly _map: Map<string, IValueMap<unknown>>;

  constructor() {
    this._map = new Map();
    this.loadMaps();
  }

  public register<K extends Keys<T>>(key: K, valueMap: IValueMap<T[K]>): void {
    this._map.set(key, valueMap);
  }

  public map<K extends Keys<T>>(key: K): IValueMap<T[K]> {
    const map = this._map.get(key);
    if (!map) { throw new Error(`No value map registered for key: ${key}`); }
    return map as IValueMap<T[K]>;
  }

  public serialize<K extends Keys<T>>(key: K, value: T[K]): string {
    return this.map(key).serialize(value);
  }

  public parse<K extends Keys<T>>(key: K, value: string): T[K] {
    return this.map(key).parse(value);
  }

  public merge<K extends T>(...values: IValueMap<unknown>[]): ValueMapStore<K> {
    const store = this as unknown as ValueMapStore<K>;
    store.addMaps(...values);
    return store;
  }

  protected addMaps(...maps: IValueMap<unknown>[]): void {
    maps.forEach(map => this._map.set(map.name, map));
  }

  private loadMaps(): void {
    this.addMaps(...DEFAULT_MAPS);
  }
}

export const valueMapStore = new ValueMapStore<ValueMap>();
