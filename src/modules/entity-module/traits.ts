import { isObject } from 'dinovel/std/helpers.ts';

export interface LevelEntity {
  id: string;
  value: number;
  max: number;
  min: number;
}

export interface StateEntity {
  id: string;
  enabled: boolean;
}

export interface StatusEntity {
  id: string;
  status: string;
}

export interface CapitalEntity {
  id: string;
  price: number;
  canBuy: boolean;
  canSell: boolean;
}

export function isLevelEntity(e: unknown): e is LevelEntity {
  return isObject<LevelEntity>(e)
    && typeof e.id === 'string'
    && typeof e.max === 'number'
    && typeof e.min === 'number'
    && typeof e.value === 'number';
}

export function isStateEntity(e: unknown): e is StateEntity {
  return isObject<StateEntity>(e)
    && typeof e.id === 'string'
    && typeof e.enabled === 'boolean';
}

export function isStatusEntity(e: unknown): e is StatusEntity {
  return isObject<StatusEntity>(e)
    && typeof e.id === 'string'
    && typeof e.status === 'string';
}

export function isCapitalEntity(e: unknown): e is CapitalEntity {
  return isObject<CapitalEntity>(e)
    && typeof e.price === 'number'
    && typeof e.id === 'string'
    && typeof e.canBuy === 'boolean'
    && typeof e.canSell === 'boolean';
}
