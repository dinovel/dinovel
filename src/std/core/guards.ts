// deno-lint-ignore-file ban-types
export function isObject<T extends {}>(e: unknown): e is T {
  return typeof e === 'object' && e !== null;
}

export function isValue<T>(e: unknown): e is T {
  return typeof e !== 'undefined' && e !== null;
}

export function isPrimitive<T extends string | number | boolean>(e: unknown): e is T {
  return typeof e === 'string' || typeof e === 'number' || typeof e === 'boolean';
}
