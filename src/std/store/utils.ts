// deno-lint-ignore-file no-explicit-any

import { JSONValue } from './models.ts';

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(deepClone) as unknown as T;
  }

  const clone = Object.create(Object.getPrototypeOf(obj));

  Object.keys(obj).forEach(key => {
    clone[key] = deepClone((obj as any)[key]);
  });

  return clone as unknown as T;
}

export function deepFreeze<T>(obj: T): T {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name as keyof T];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

export function deepEqual(a: JSONValue, b: JSONValue): boolean {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    if (a instanceof Array && b instanceof Array) {
      if (a.length !== b.length) {
        return false;
      }

      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const key of aKeys) {
      const aValue = (a as any)[key];
      const bValue = (b as any)[key];

      if (!deepEqual(aValue, bValue)) {
        return false;
      }
    }

    return true;
  }

  return false;
}
