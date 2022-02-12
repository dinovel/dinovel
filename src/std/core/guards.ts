// deno-lint-ignore-file ban-types
export function isObject(e: unknown): e is object {
  return typeof e === 'object' && e !== null;
}
