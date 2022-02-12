import { logger } from '../logger.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';

export function printVersion(): number {
  const { version } = Dinovel.runtime

  logger.info(`v8: ${version.v8Version}`);
  logger.info(`deno: ${version.denoVersion}`);
  logger.info(`dinovel: ${version.dinovelVersion}`);
  logger.info(`typescript: ${version.typescriptVersion}`);
  return 0;
}
