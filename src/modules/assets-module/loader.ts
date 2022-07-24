import { createGlobal } from 'dinovel/std/helpers.ts';
import type { Asset, AssetsMap } from './models.ts';

export const ASSETS_PREFIX = '__ASSETS__';

export const ASSETS_KEY = Symbol.for(ASSETS_PREFIX);

export const ASSET_BY_ID_PREFIX = '/dinovel/asset/';

export const assetsHandler = createGlobal<AssetsMap>(ASSETS_KEY, {});

export function setAssetsMap(map: AssetsMap) {
  assetsHandler.set(map);
}

export function getAssetsMap(): AssetsMap {
  return assetsHandler.value;
}

export function getAsset(id: string): Asset {
  return assetsHandler.value[id];
}

/** Build asset url */
export function buildAssetUrl(id: string): string {
  return ASSET_BY_ID_PREFIX + id;
}
