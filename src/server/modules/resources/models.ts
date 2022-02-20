import type { AppResources, AppNames, ResourceCatMap, ResourceExtMap } from 'dinovel/engine/resources/__.ts';

export type DirMap = { [key: string]: DirMap | string };

export interface ResourceState {
  resources: AppResources;
  names: AppNames;
  files: DirMap;
  categories: ResourceCatMap;
  extensions: ResourceExtMap;
}
