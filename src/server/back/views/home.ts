import { buildView } from './_base.ts';

export function buildHomeView(): string {
  const body = /*html*/`<h1>Home</h1>`;
  return buildView(body, { title: 'Dinovel' });
}
