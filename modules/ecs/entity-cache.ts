import { Entity } from './entity.ts';
import { ComponentToken, isComponent } from './component.ts';

export class EntityCache {
  #cache = new Map<ComponentToken[], Entity[]>();
  #source = new Set<Entity>();

  set(entities: Entity[], requires: ComponentToken[]) {
    this.#cache.set(requires, entities);
  }

  get(requires: ComponentToken[]) {
    const res = this.#cache.get(requires);
    if (res) return res;

    if (requires.length === 0) {
      const all = [...this.#source];
      this.set(all, requires);
      return all;
    }

    const entities = [...this.#source].filter((entity) => {
      return requires.every((token) => isComponent(entity, token));
    });

    this.#cache.set(requires, entities);
    return entities;
  }

  reset(entities: Set<Entity>) {
    this.#source = entities;
    this.#cache.clear();
  }
}
