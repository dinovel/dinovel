export type ResourceType = 'image' | 'audio' | 'video';

export type ResourceCategory = 'background' | 'sprite' | 'ui' | 'portrait' | 'music' | 'sfx' | 'video' | 'loop';

export type ResourcePath = {
  path: string;
  type: ResourceType;
}

export type ResourceMetadata = {
  category: ResourceCategory;
  tags: string[];
  id: string;
}

export type Resource = ResourcePath & ResourceMetadata;

export type ResourceMap = {
  [id: string]: Resource;
}

export type ResourceNames<T extends ResourceMap> = {
  [key: string]: keyof T & string;
}

export type ResourceExtMap = {
  [key in ResourceType]: string[];
}

export type ResourceCatMap = {
  [key in ResourceType]: ResourceCategory[];
}

export type AppResources = {
  [folder: string]: ResourceMap;
}

export type AppNames = {
  // deno-lint-ignore no-explicit-any
  [key: string]: ResourceNames<any>;
}
