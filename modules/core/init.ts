import { container } from '../infra/mod.ts';
import { IDinovel, InitOptions } from './models.ts';
import { registerECSService } from '../ecs/mod.ts';
import { LogLevel, LogWriterConsole, registerLoggerServices } from '../logger/mod.ts';
import { registerRenderServices } from '../render/mod.ts';
import { Dinovel } from './dinovel.ts';
import { registerUIStoreService } from '../ui/mod.ts';

let dinovel: IDinovel | undefined;

export function initDinovel({
  rootDocument,
  depsContainer = container,
  registerDefaults = true,
}: InitOptions) {
  if (dinovel) {
    throw new Error('Dinovel has already been initialized.');
  }

  if (registerDefaults) {
    registerECSService(depsContainer);
    registerLoggerServices(depsContainer);
    registerRenderServices(rootDocument, depsContainer);
    registerUIStoreService(depsContainer);
  }

  dinovel = new Dinovel(depsContainer);

  if (registerDefaults) {
    dinovel.logger.use(new LogWriterConsole('Dinovel'));
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
