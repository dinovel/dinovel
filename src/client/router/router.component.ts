import { declareComponent } from 'dinovel/render/declare.ts';
import { AppRouter } from './app-router.ts';
import { events } from '../core/events.ts';
import { SESSION_KEY_NAV } from '../core/constants.ts';

let template = /*html*/`<div class="router-view" v-if="active">`;

const names = Object.keys(AppRouter);
names.forEach(name => {
  template += `\n  <${name} v-if="active === '${name}'"></${name}>`;
});
template += `\n</div>`;

export const RouterView = declareComponent({
  template,
  components: {...AppRouter},
  data() {
    return {
      active: sessionStorage.getItem(SESSION_KEY_NAV) || 'home',
    }
  },
  mounted() {
    events.on('nav', path => {
      sessionStorage.setItem(SESSION_KEY_NAV, path);
      this.active = path || 'home';
    });
  }
});
