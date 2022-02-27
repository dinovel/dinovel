import { declareComponent } from 'dinovel/render/declare.ts';
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
  observable: {
    appNav() {
      return appStore.select('nav');
    }
  },
  computed: {
    current() {
      return this.$obs.appNav.current;
    }
  },
});
