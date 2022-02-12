import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js';

import {
  Attribute,
  BaseAttribute,
  MaybeAttribute,
  ValueAttribute,
} from './models.ts';

type Props = Pick<BaseAttribute, 'description' | 'triggerRender'>;
type ValueProps<T> = Pick<ValueAttribute<T>, 'fromValue' | 'fromString'>;
type MaybeProps<T> = Pick<MaybeAttribute<T>, 'fromValue' | 'fromString' | 'default'>;

export function stringAttr(name: string, defaultValue: string, props?: Props & ValueProps<string>): ValueAttribute<string>;
export function stringAttr(name: string, props?: Props & MaybeProps<string>): MaybeAttribute<string>;
export function stringAttr(name: string, defOrProps?: string | (Props & MaybeProps<string>), valProps?: Props & ValueProps<string>): Attribute<string> {
  const defaultValue = typeof defOrProps === 'string' ? defOrProps : '';
  const props = (typeof defOrProps === 'string' ? valProps : defOrProps) ?? {};

  return {
    name,
    type: 'string',
    fromString: ((s: string) => Html5Entities.decode(s || '')),
    fromValue: (e: string | undefined) => Html5Entities.encode(e|| ''),
    default: defaultValue,
    ...props,
  }
}

export function arrayAttr<T>(name: string, defaultValue: T[], props?: Props & ValueProps<T[]>): ValueAttribute<T[]>;
export function arrayAttr<T>(name: string, props?: Props & MaybeProps<T[]>): MaybeAttribute<T[]>;
export function arrayAttr<T>(
  name: string,
  defOrProps?: T[] | (Props & MaybeProps<T[]>),
  valProps?: Props & ValueProps<T[]>
): Attribute<T[]> {
  const defaultValue = typeof defOrProps === 'string' ? defOrProps : [];
  const props = (typeof defOrProps === 'string' ? valProps : defOrProps) ?? {};

  return {
    name,
    type: 'string-tupple',
    fromString: (s: string) => fromHtmlObject<T[]>(s, []),
    fromValue: (e: T[] | undefined) => toHtmlObject(e, defaultValue),
    default: defaultValue,
    ...props,
  }
}

export function fromHtmlObject<T>(v: string, def: T): T {
  try {
    return JSON.parse(Html5Entities.decode(v || '')) as T;
  } catch {
    return def;
  }
}

export function toHtmlObject<T>(v: T | undefined, def: T): string {
  return Html5Entities.encode(JSON.stringify(v ?? def));
}
