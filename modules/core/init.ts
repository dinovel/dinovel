import { container } from '../infra/mod.ts';
import { IDinovel, InitOptions } from './models.ts';
import { registerECSService } from '../ecs/mod.ts';
import { LogLevel, LogWriterConsole, registerLoggerServices } from '../logger/mod.ts';
import { registerRenderServices } from '../render/mod.ts';
import { Dinovel } from './dinovel.ts';
import { registerUIStoreService } from '../ui/mod.ts';
import { registerSaveService } from '../save/mod.ts';
import { registerScenesService } from '../scenes/mod.ts';

let dinovel: IDinovel | undefined;

export function initDinovel({
  rootDocument,
  depsContainer = container,
  registerDefaults = true,
  logLevel = LogLevel.info,
}: InitOptions) {
  if (dinovel) {
    throw new Error('Dinovel has already been initialized.');
  }

  if (registerDefaults) {
    registerLoggerServices(depsContainer);
    registerSaveService(depsContainer);
    registerECSService(depsContainer);
    registerRenderServices(rootDocument, depsContainer);
    registerUIStoreService(depsContainer);
    registerScenesService(depsContainer);
  }

  dinovel = new Dinovel(depsContainer);

  if (registerDefaults) {
    const writer = new LogWriterConsole('Dinovel');
    writer.setLevel(logLevel);
    dinovel.logger.use(writer);
  }

  // deno-lint-ignore no-explicit-any
  (globalThis as any).Dinovel = dinovel;

  dinovel.logger.write({
    level: LogLevel.trace,
    attr: { registerDefaults },
    message: 'Dinovel initialized.',
    section: 'Dinovel',
    time: new Date(),
  });

  return dinovel;
}

export function getDinovel(): IDinovel {
  if (!dinovel) {
    throw new Error('Dinovel has not been initialized.');
  }

  return dinovel;
}
