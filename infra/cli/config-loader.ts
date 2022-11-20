import { DinovelConfig } from '../config.ts';

async function loadRawConfig(path: string): Promise<string> {
  try {
    return await Deno.readTextFile(path);
  } catch {
    return '{}';
  }
}

function loadConfig(rawData: string): Partial<DinovelConfig> {
  try {
    return JSON.parse(rawData);
  } catch {
    return {};
  }
}

export async function loadDinovelConfig(path: string): Promise<DinovelConfig> {
  const rawData = await loadRawConfig(path);
  const config = loadConfig(rawData);

  return {
    assets: './assets',
    entry: './main.ts',
    scripts: [],
    styles: ['./style.scss'],
    title: 'Dinovel',
    ...config,
    devServer: {
      auto: true,
      port: 8666,
      ...(config.devServer ?? {}),
    },
  };
}
