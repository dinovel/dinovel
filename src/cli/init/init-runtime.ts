import type { Dinovel } from 'dinovel/engine/dinovel.ts';
import { loadDinovelConfiguration, setRuntime } from 'dinovel/engine/internal/__.ts';

export async function initDinovelRuntime({ logger }: typeof Dinovel, path?: string): Promise<void> {
  const filePath = path ?? './dinovel.json';
  const [sucess, config] = await loadDinovelConfiguration(filePath);
  if (!sucess) { logger.warning('No configuration file found, using default configuration'); }
  setRuntime({
    config,
    version: {
      dinovelVersion: '0.1.0',
      denoVersion: Deno.version.deno,
      typescriptVersion: Deno.version.typescript,
      v8Version: Deno.version.v8,
    }
  });
}
