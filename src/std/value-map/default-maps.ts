import { IFullValueMap } from "./models.ts";
import { buildValueMap } from './value-map-builder.ts';

export const DEFAULT_MAPS: IFullValueMap<unknown>[] = [
  buildValueMap<string>('string', s => s, s => s, ''),
  buildValueMap<number>('number', n => n.toString(), n => Number(n), 0),
  buildValueMap<boolean>('boolean', b => b ? 'true' : 'false', b => b === 'true', false),
];
