import { declareComponent, obs } from 'dinovel/render/__.ts';
import { AppRouter } from './app-router.ts';
import { appStore } from '../store/store.ts';

let template = /*html*/`<div class="router-view">`;

const names = Object.keys(AppRouter);
names.forEach(name => {
  template += `\n  <${name} v-if="current === '${name}'"></${name}>`;
});
template += `\n</div>`;

export const RouterView = declareComponent({
  template,
  components: {...AppRouter},
  setup() {
    const current = obs(appStore.select('nav'), e => e.current);

    return { current };
  }
});
