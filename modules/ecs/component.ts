import type { Entity } from './entity.ts';

export type ComponentToken<T = unknown> = symbol & { readonly _type?: T };
export type Component<T = unknown> = { [key: ComponentToken<T>]: T };
export type ComponentFactory<T = unknown> = {
  type: ComponentToken<T>;
  apply: (entity: Entity, state?: Partial<T>) => Entity & Component<T>;
};

export function isComponent<T>(e: Entity, token: ComponentToken<T>): e is Entity & Component<T> {
  return token in e;
}

export function setComponent<T>(e: Entity, token: ComponentToken<T>, value: T): Entity & Component<T> {
  return Object.assign(e, { [token]: value });
}

export function createComponent<T>(name: string, initialState: T): ComponentFactory<T> {
  const token = Symbol.for(name) as ComponentToken<T>;
  return {
    type: token,
    apply: (entity, state) => setComponent(entity, token, { ...initialState, ...state }),
  };
}

export function removeComponent<T>(e: Entity, token: ComponentToken<T>): Entity {
  if (isComponent(e, token)) {
    delete e[token as symbol];
  }

  return e;
}
