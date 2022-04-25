import { declareComponent } from 'dinovel/render/declare.ts';
import { DnDialogHost } from 'dinovel/dialog/dialog-host.component.ts';
import { RouterView } from './router/router.component.ts';
import { AppBar } from './components/organism/app-bar.ts';

const template = /*html*/`<div class="app__container">
  <app-bar></app-bar>
  <router-view></router-view>
  <dn-dialog-host></dn-dialog-host>
</div>`;

export const DinovelApp = declareComponent({
  template,
  components: {
    RouterView,
    AppBar,
    DnDialogHost,
  },
});
