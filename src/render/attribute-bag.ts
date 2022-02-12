// deno-lint-ignore-file no-explicit-any
import {
  IObservable,
  IValueObservable,
  Subject,
  ValueSubject,
} from 'dinovel/std/reactive/__.ts';

import {
  Attribute,
  AttributeMap,
  ValueAttribute,
} from './models.ts';

/** Helper class to handle attributes for an HTMLElement */
export class AttributeBag {
  private readonly _element: HTMLElement;
  private readonly _attr: Map<string, AttributeChangeMap<unknown>> = new Map();
  private readonly _anyChange = new Subject<string>();
  private readonly _input: { [key: string]: Attribute<unknown> };

  constructor(element: HTMLElement, map: any) {
    this._element = element;
    this.__initAttributes(Object.values(map));
    this._input = map;
  }

  /** Triggers when any property changes */
  public get onChange(): IObservable<string> {
    return this._anyChange;
  }

  /** Set new value for attribute */
  public valueChanged(name: string, old: string, val: string): void {
    if (old === val) return;
    const map = this._attr.get(name);
    if (!map) return;
    const nValue = map.fromString(val);
    const oValue = map.fromString(old);
    if (nValue === oValue) return;
    map.mapValue.next(nValue);
  }

  /** Get attribute observable */
  public getAttr<T>(name: string): IValueObservable<T> {
    const map = this._attr.get(name) as AttributeChangeMap<T>;
    if (!map) throw new Error(`Attribute ${name} not found in ${this._element.tagName}`);
    return map.mapValue;
  }

  public initMap<T>(): AttributeMap<T> {
    const map = {} as AttributeMap<T>;
    const src = this._input as unknown as T;

    for (const key in src) {
      Object.defineProperty(map, key, {
        get: () => this.getAttr(key).value as any,
      });
    }

    return map;
  }

  private __initAttributes(list: ValueAttribute<unknown>[]): void {
    for (const attr of list) {
      const map = createAttMap(attr, this._element);
      map.strValue.subscribe({
        next: () => this._anyChange.next(attr.name)
      });
      this._attr.set(attr.name, map);
    }
  }
}

interface AttributeChangeMap<T> {
  readonly name: string;
  strValue: ValueSubject<string>;
  mapValue: ValueSubject<T>;
  fromValue: (e: T) => string;
  fromString: (s: string) => T;
}

function createAttMap<T>(att: ValueAttribute<T>, target: HTMLElement): AttributeChangeMap<T> {
  const item: AttributeChangeMap<T> = {
    name: att.name,
    mapValue: new ValueSubject(att.default),
    strValue: new ValueSubject(''),
    fromValue: att.fromValue ?? String,
    fromString: att.fromString ?? String as unknown as (s: string) => T,
  };

  item.strValue
    .subscribe({ next: v => {target.setAttribute(att.name, v)} });

  item.mapValue
    .subscribe({ next: v => item.strValue.next(item.fromValue(v)) });

  return item;
}
