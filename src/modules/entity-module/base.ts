import { isObject } from 'dinovel/std/helpers.ts';

export interface BaseEntity {
  id: string;
}

export interface Entity {
  id: string;
  name: string;
  description: string;
}

export interface TypeEntity {
  id: string;
  type: string;
  tags: string[];
}

export interface LogicalEntity {
  id: string;
  bool: string; // TODO: define logical entity type
}

export interface LogicalAssetEntity {
  bool: string; // TODO: define logical asset type
  value: string;
}

export type ValueAsset = string;

export type EntityAsset = LogicalAssetEntity | ValueAsset;

export function isEntity(e: unknown): e is Entity {
  return isObject<Entity>(e)
    && typeof e.description === 'string'
    && typeof e.id === 'string'
    && typeof e.name === 'string';
}

export function isTypeEntity(e: unknown): e is TypeEntity {
  return isObject<TypeEntity>(e)
    && Array.isArray(e.tags)
    && typeof e.id === 'string'
    && typeof e.type === 'string'
    && e.tags.every(tag => typeof tag === 'string');
}

export function isLogicalEntity(e: unknown): e is LogicalEntity {
  return isObject<LogicalEntity>(e)
    && typeof e.id === 'string'
    && typeof e.bool === 'string';
}

export function isLogicalAssetEntity(e: unknown): e is LogicalAssetEntity {
  return isObject<LogicalAssetEntity>(e)
    && typeof e.bool === 'string'
    && typeof e.value === 'string';
}

export function isEntityAsset(e: unknown): e is EntityAsset {
  return isLogicalAssetEntity(e) || typeof e === 'string';
}
