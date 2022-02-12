// deno-lint-ignore-file no-explicit-any
import { Type } from 'dinovel/std/core/types.ts';

export type RenderResult = Node | Node[] | undefined;

/** Details to register a new web component */
export interface Definition {
  /** html tag to use */
  tagName: string;
  /** Class that implements element logic */
  constructor: Type<HTMLElement>;
  /** Description to use in documentation */
  description?: string;
  /** Ignore this component when showing the docs */
  skipDocs?: boolean;
  /** Attributes map */
  attributes?: { [key: string]: Attribute<any>; };
}

/** Attribute details */
export interface BaseAttribute {
  /** Name of the attribute */
  name: string;
  /** Type of the attribute */
  type: string;
  /** Description of the attribute */
  description?: string;
  /** changes trigger a new render, defaults to true */
  triggerRender?: boolean;
}

/** Attribute with default value */
export interface ValueAttribute<T> extends BaseAttribute {
  /** Default value of the attribute */
  default: T;
  /** Map value to string */
  fromValue?: (e: T) => string;
  /** Map value from string */
  fromString?: (s: string) => T;
}

/** Attribute that can have no value */
export interface MaybeAttribute<T> extends BaseAttribute {
  /** Default value of the attribute */
  default?: T | undefined;
  /** Map value to string */
  fromValue?: (e: T | undefined) => string;
  /** Map value from string */
  fromString?: (s: string) => T | undefined;
}

/** Web component attribute */
export type Attribute<T> = ValueAttribute<T> | MaybeAttribute<T>;

export type AttributeMap<T> = { [K in keyof T]: T[K] extends ValueAttribute<infer U1> ? U1
  : T[K] extends MaybeAttribute<infer U2> ? U2 | undefined : never };
export type ObservableMap<T> = { [K in keyof T]: T[K] extends ValueAttribute<infer U1> ? U1
    : T[K] extends MaybeAttribute<infer U2> ? U2 | undefined : never };
