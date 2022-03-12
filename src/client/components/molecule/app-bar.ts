import { declareComponent } from 'dinovel/render/declare.ts';
import { AppRouterNames } from '../../router/app-router.ts';
import { NavBar } from './nav-bar.ts';
import { ButtonReset } from '../atom/button-reset.ts';

export const AppBar = declareComponent({
  template: /*html*/`<div class="app-bar">
    <h3 class="brand">{{title}}</h3>
    <nav-bar :views="views"></nav-bar>
    <div class="right">
      <button-reset class="tt-left tt-bottom" data-tt="Clear state and reload data" ></button-reset>
    </div>
  </div>`,
  data() {
    return {
      title: 'Dinovel',
      views: AppRouterNames,
    };
  },
  components: { NavBar, ButtonReset },
});
