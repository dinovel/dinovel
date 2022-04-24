import { IFullValueMap } from "./models.ts";
import { isValue } from '../core/guards.ts';

export function buildValueMap<T>(
  name: string,
  serialize: (value: T) => string,
  parse: (value: string) => T,
  defaultValue: T,
): IFullValueMap<T> {
  function S(value: T[]): string[];
  function S(value: T): string;
  function S(value: T | T[]): string | string[] {
    if (!isValue(value)) {
      return serialize(defaultValue);
    }

    if (Array.isArray(value)) {
      return value.map(serialize);
    }

    return serialize(value);
  }

  function P(value: string[]): T[];
  function P(value: string): T;
  function P(value: string | string[]): T | T[] {
    if (!isValue(value)) {
      return defaultValue;
    }

    if (Array.isArray(value)) {
      return value.map(parse);
    }

    return parse(value);
  }

  return {
    serialize: S,
    parse: P,
    name,
  };
}
