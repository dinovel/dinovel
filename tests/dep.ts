export * as t from 'deno/testing/asserts.ts';
export * as m from 'deno/testing/mock.ts';

export * as modInfra from '../modules/infra/mod.ts';
export * as modEcs from '../modules/ecs/mod.ts';
export * as modRender from '../modules/render/mod.ts';

export * from './mock.ts';

export function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
