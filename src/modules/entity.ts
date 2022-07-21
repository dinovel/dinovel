import { isObject } from 'dinovel/std/helpers.ts';

export interface Entity {
  id: string;
  name: string;
  description: string;
}

export function isEntity(e: unknown): e is Entity {
  return isObject<Entity>(e)
    && typeof e.description === 'string'
    && typeof e.id === 'string'
    && typeof e.name === 'string';
}

export interface EntityLogicalAsset {
  bool: string; // TODO: define logical asset type
  value: string;
}

export function isEntityLogicalAsset(e: unknown): e is EntityLogicalAsset {
  return isObject<EntityLogicalAsset>(e)
    && typeof e.bool === 'string'
    && typeof e.value === 'string';
}

export type EntityValueAsset = string;

export interface EntityAsset {
  id: string;
  assets: (EntityLogicalAsset | EntityValueAsset)[];
}

export function isEntityAsset(e: unknown): e is EntityAsset {
  return isObject<EntityAsset>(e)
    && typeof e.id === 'string'
    && Array.isArray(e.assets)
    && e.assets.every(e => isEntityLogicalAsset(e) || typeof e === 'string');
}
