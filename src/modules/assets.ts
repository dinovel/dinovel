export type AssetType = 'image' | 'audio' | 'video' | 'unknown';
export type AssetCategory = 'background' | 'sprite' | 'ui' | 'portrait' | 'music' | 'sfx' | 'video' | 'animation' | 'logo' | 'asset';

export const ASSETS_PREFIX = '__ASSETS__';

export const DEFAULT_EXTENSIONS: AssetExtMap = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  audio: ['.mp3', '.ogg', '.flac'],
  video: ['.mp4', '.webm'],
  unknown: []
};

export type Asset = {
  type: AssetType;
  category: AssetCategory;
  tags: string[];
  id: string;
  path: string;
};

export type AssetsMap = Record<string, Asset>;

export type AssetExtMap = {
  [key in AssetType]: string[];
};
