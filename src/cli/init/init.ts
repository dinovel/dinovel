import { logger } from '../logger.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { initDinovelRuntime } from './init-runtime.ts';

export async function initDinovel(path?: string): Promise<void> {
  Dinovel.logger = logger;
  await initDinovelRuntime(Dinovel, path);
}
