// Helper types for type-checking and type-inference

/** Key names for object */
export type Keys<T> = Extract<keyof T, string>;
