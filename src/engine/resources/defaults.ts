import { ResourceCatMap, ResourceExtMap } from './models.ts';

export const DefaultExtensions: ResourceExtMap = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  audio: ['.mp3', '.ogg', '.flac'],
  video: ['.mp4', '.webm'],
};

export const DefaultCategories: ResourceCatMap = {
  image: ['background', 'sprite', 'ui', 'portrait'],
  audio: ['music', 'sfx'],
  video: ['loop', 'video'],
};
