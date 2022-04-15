import { IValueMap } from "./models.ts";
import { buildValueMap } from './value-map-builder.ts';

export const DEFAULT_MAPS: IValueMap<unknown>[] = [
  buildValueMap<string>('string', s => s, s => s, ''),
  buildValueMap<number>('number', n => n.toString(), n => Number(n), 0),
];
