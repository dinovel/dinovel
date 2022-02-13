// deno-lint-ignore-file no-explicit-any
export type MaybePromise<T> = T | Promise<T>;

export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
