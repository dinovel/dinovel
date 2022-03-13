import { declareComponent } from 'dinovel/render/declare.ts';
import { RouterView } from './router/router.component.ts';
import { AppBar } from './components/organism/app-bar.ts';

const template = /*html*/`<div class="app__container">
  <app-bar></app-bar>
  <router-view></router-view>
</div>`;

export const DinovelApp = declareComponent({
  template,
  components: {
    RouterView,
    AppBar
  },
});
