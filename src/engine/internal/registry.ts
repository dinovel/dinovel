import type { WebComponentsRegistry } from 'dinovel/render/__.ts';

let runtimeRegistry: WebComponentsRegistry | undefined = undefined;

export function setRegistry(registry: WebComponentsRegistry) {
  runtimeRegistry = registry;
}

export function getRegistry(): WebComponentsRegistry {
  if (runtimeRegistry === undefined) {
    throw new Error('Web components registry is not available!');
  }
  return runtimeRegistry;
}
