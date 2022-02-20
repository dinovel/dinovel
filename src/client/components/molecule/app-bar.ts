import { declareComponent } from 'dinovel/render/declare.ts';
import { AppRouterNames } from '../../router/app-router.ts';
import { NavBar } from './nav-bar.ts';

export const AppBar = declareComponent({
  template: /*html*/`<div class="app-bar">
    <h3 class="brand">{{title}}</h3>
    <nav-bar :views="views"></nav-bar>
  </div>`,
  data() {
    return {
      title: 'Dinovel',
      views: AppRouterNames,
    };
  },
  components: { NavBar },
});
