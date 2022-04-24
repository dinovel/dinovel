// deno-lint-ignore-file no-explicit-any

/** Clone of object */
export type ObjectOf<T> = { [key in keyof T]: T[key] };

/** Generic constructor type */
export type Type<T> = new (...args: any[]) => T;

/** Key names for object */
export type Keys<T> = Extract<keyof T, string>;

/** Generic result */
export type Result<T> = ResultSuccess<T> | ResultError;

export type ResultSuccess<T> = {
  success: true;
  data: T;
};

export type ResultError = {
  success: false;
  error: string;
  code: number;
};

export type ValueConverter<T> = {
  from: (value: T) => string;
  to: (value: string) => T;
}

export type MaybePromise<T> = T | Promise<T>;

export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
