import { Entity } from './entity.ts';
import { System } from './system.ts';
import { EntityCache } from './entity-cache.ts';
import type { ISaveHandler, SaveModule } from '../save/mod.ts';
import type { ILogger, ILoggerFactory } from '../logger/mod.ts';

interface SaveSateV1 {
  entities: Entity[];
  version: '0.1.0';
}

type SaveSate = SaveSateV1;

export class ECS implements SaveModule<SaveSate> {
  id = 'DINOVEL_ECS_MODULE';
  #entities = new Set<Entity>();
  #toDelete = new Set<Entity>();
  #systems = new Set<System>();
  #cache = new EntityCache();
  #logger: ILogger;
  #lastEntityId = 0;

  public constructor(saveHandler: ISaveHandler, loggerFactory: ILoggerFactory) {
    this.#logger = loggerFactory.createLogger('ECS');
    saveHandler.register(this);
  }

  public importEntities(entities: Entity[]) {
    for (const entity of entities) {
      const newEntity = this.createEntity();
      Object.assign(newEntity, annonimyzeEntity(entity));
    }
  }

  createEntity(): Entity {
    const entity = { id: (this.#lastEntityId++) };
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

  save(): SaveSate {
    return {
      version: '0.1.0',
      entities: [...this.#entities],
    };
  }

  load(state?: SaveSate): void {
    if (!state) {
      const errMessage = 'No save state provided to loader';
      this.#logger.error(errMessage);
      throw new Error(errMessage);
    }

    this.#loadSaveState(state);
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

  #loadSaveState(state: SaveSate) {
    if (state.version === '0.1.0') {
      this.#entities.forEach((entity) => this.#toDelete.add(entity));
      this.#entities.clear();
      this.#clear();

      this.#lastEntityId = state.entities.reduce((acc, entity) => {
        if (entity.id > acc) {
          return entity.id;
        }
        return acc;
      }, 0);

      state.entities.forEach((entity) => {
        this.#entities.add(entity);
      });
    } else {
      const errMessage = `Unknown save state version [${state.version}]`;
      this.#logger.error(errMessage);
      throw new Error(errMessage);
    }
  }
}

function annonimyzeEntity(entity: Entity) {
  // deno-lint-ignore no-unused-vars
  const { id, ...rest } = entity;
  return rest;
}
