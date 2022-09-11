import { isObject } from 'dinovel/std/helpers.ts';
import { EntityAsset, isEntityAsset } from './base.ts';

export interface DisplayEntity {
  id: string;
  visual: EntityAsset[];
}

export interface IconEntity {
  id: string;
  icon: EntityAsset[];
}

export interface PortraitEntity {
  id: string;
  portrait: EntityAsset[];
}

export interface Sprite {
  id: string;
  states: EntityAsset[];
  interval: number;
  loop: boolean;
}

export function isDisplayEntity(e: unknown): e is DisplayEntity {
  return isObject<DisplayEntity>(e)
    && Array.isArray(e.visual)
    && typeof e.id === 'string'
    && e.visual.every(isEntityAsset);
}

export function isIconEntity(e: unknown): e is IconEntity {
  return isObject<IconEntity>(e)
    && Array.isArray(e.icon)
    && typeof e.id === 'string'
    && e.icon.every(isEntityAsset);
}

export function isPortraitEntity(e: unknown): e is PortraitEntity {
  return isObject<PortraitEntity>(e)
    && Array.isArray(e.portrait)
    && typeof e.id === 'string'
    && e.portrait.every(isEntityAsset);
}

export function isSprite(e: unknown): e is Sprite {
  return isObject<Sprite>(e)
    && Array.isArray(e.states)
    && typeof e.id === 'string'
    && typeof e.interval === 'number'
    && typeof e.loop === 'boolean';
}
