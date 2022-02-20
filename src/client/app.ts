import { declareComponent } from 'dinovel/render/declare.ts';
import { RouterView } from './router/router.component.ts';

const template = /*html*/`<div class="app__container">
  <div class="app__header">
    <h1>Dinovel</h1>
  </div>
  <router-view></router-view>
</div>`;

export const DinovelApp = declareComponent({
  template,
  components: {
    RouterView,
  },
});
