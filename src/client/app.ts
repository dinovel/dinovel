import { declareComponent } from 'dinovel/render/declare.ts';
import { home } from './views/home.ts';

const template = /*html*/`<div class="app__container">
  <div class="app__header">
    <h1>Dinovel</h1>
  </div>
  <home></home>
</div>`;

export const App = declareComponent({
  template,
  components: { home },
});
