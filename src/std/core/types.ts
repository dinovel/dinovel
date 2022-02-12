/** Clone of object */
export type ObjectOf<T> = { [key in keyof T]: T[key] };

/** Generic constructor type */
// deno-lint-ignore no-explicit-any
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
