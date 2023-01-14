import { ILogger, ILoggerFactory } from '../logger/mod.ts';
import { ISaveHandler, SaveModule } from './models.ts';

export class SaveHandler implements ISaveHandler {
  #modules = new Map<string, SaveModule>();
  #logger: ILogger;

  constructor(loggerFactory: ILoggerFactory) {
    this.#logger = loggerFactory.createLogger('SaveHandler');
  }

  register<T>(...modules: SaveModule<T>[]): void {
    for (const module of modules) {
      if (this.#modules.has(module.id)) {
        this.#logger.warn(`Module for id [${module.id}] is already registered`);
        continue;
      }

      this.#modules.set(module.id, module as SaveModule);
    }
  }

  async loadSaveState(data: string): Promise<void> {
    let state: Record<string, unknown>;

    try {
      state = JSON.parse(data);
    } catch (err) {
      const errorMessage = 'Failed to parse save data';
      this.#logger.error(errorMessage, err);
      throw new Error(errorMessage);
    }

    for (const [id, module] of this.#modules) {
      const moduleState = state[id];

      try {
        await module.load(moduleState);
      } catch (err) {
        this.#logger.error(`Failed to load module [${id}]`, err);
      }
    }
  }

  async createSaveSate(): Promise<string> {
    const data: Record<string, unknown> = {};

    for (const [id, module] of this.#modules) {
      try {
        const moduleData = await module.save();

        if (moduleData === undefined) {
          // Ensure that the data is serializable
          JSON.stringify(moduleData);

          data[id] = moduleData;
        }
      } catch (err) {
        this.#logger.error(`Failed to save module [${id}]`, err);
      }
    }

    return JSON.stringify(data);
  }
}
