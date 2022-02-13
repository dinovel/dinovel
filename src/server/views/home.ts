import { buildView } from './_base.ts';

export function buildHomeView(): string {
  return buildView('<div id="app"></div>', { title: 'Dinovel' });
}
