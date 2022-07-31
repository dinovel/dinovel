// deno-lint-ignore-file no-empty-interface ban-types
// Helper types for type-checking and type-inference

/** Key names for object */
export type Keys<T> = Extract<keyof T, string>;

/** Object of values */
export interface JSONObject extends Record<string, JSONValue> {}
/** List of store values */
export interface JSONArray extends Array<JSONValue> {}
/** Possible types, for a store */
export type JSONValue = string | number | boolean | null | undefined | JSONObject | JSONArray;
/** Empty object, utility type */
export type Unit = {};
