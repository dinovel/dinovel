import { Entity } from './entity.ts';
import { System } from './system.ts';
import { EntityCache } from './entity-cache.ts';

export class ECS {
  #entities = new Set<Entity>();
  #toDelete = new Set<Entity>();
  #systems = new Set<System>();
  #cache = new EntityCache();
  #lastEntityId = 0;

  public importEntities(entities: Entity[]) {
    for (const entity of entities) {
      const newEntity = this.createEntity();
      Object.assign(newEntity, annonimyzeEntity(entity));
    }
  }

  createEntity(): Entity {
    const entity = { id: this.#lastEntityId++ };
    this.#entities.add(entity);
    return entity;
  }

  removeEntity(entity: Entity) {
    this.#entities.delete(entity);
    this.#toDelete.add(entity);
  }

  addSystem(system: System) {
    this.#systems.add(system);
  }

  removeSystem(system: System) {
    this.#systems.delete(system);
  }

  update(tick: DOMHighResTimeStamp) {
    this.#cache.reset(this.#entities);
    this.#update(tick);
    this.#draw(tick);
    this.#clear();
  }

  #update(tick: DOMHighResTimeStamp) {
    for (const system of this.#systems) {
      const entities = this.#cache.get(system.requires);
      system.update?.(tick, entities);
    }
  }

  #draw(tick: DOMHighResTimeStamp) {
    for (const system of this.#systems) {
      const entities = this.#cache.get(system.requires);
      system.draw?.(tick, entities);
    }
  }

  #clear() {
    const toRemove = [...this.#toDelete];
    for (const system of this.#systems) {
      system.clear?.(toRemove);
    }
    this.#toDelete.clear();
  }
}

function annonimyzeEntity(entity: Entity) {
  // deno-lint-ignore no-unused-vars
  const { id, ...rest } = entity;
  return rest;
}
