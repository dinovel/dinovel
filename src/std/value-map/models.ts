export interface IValueMap<T> {
  serialize(value: T): string;
  serialize(value: T[]): string[];
  parse(value: string): T;
  parse(value: string[]): T[];
  name: string;
}

export type ValueMap = {
  number: number;
}
