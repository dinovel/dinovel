export interface IValueMap<T> {
  serialize(value: T): string;
  parse(value: string): T;
}

export interface IFullValueMap<T> extends IValueMap<T> {
  serialize(value: T[]): string[];
  serialize(value: T): string;
  serialize(value: T | T[]): string | string[];
  parse(value: string[]): T[];
  parse(value: string): T;
  parse(value: string): T | T[];
  name: string;
}

export type ValueMap = {
  number: number;
  string: string;
  boolean: boolean;
}
