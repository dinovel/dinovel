import type { ResourceMap, AppResources, ResourceCatMap, ResourceExtMap } from 'dinovel/engine/resources/__.ts';

export type DirMap = { [key: string]: DirMap | string };

export type ResourceState = {
  resources: ResourceMap;
  resMap: AppResources;
  files: DirMap;
  categories: ResourceCatMap;
  extensions: ResourceExtMap;
}
