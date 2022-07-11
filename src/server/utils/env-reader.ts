import { parse } from 'deno/flags/mod.ts';

export interface DinovelConfig {
  port: number;
  mode: 'dev' | 'prod';
}

export function readEnv(): DinovelConfig {
  const args = parse(Deno.args);

  const res: DinovelConfig = {
    port: args.port || 8666,
    mode: args.mode || 'dev',
  };

  return res;
}
