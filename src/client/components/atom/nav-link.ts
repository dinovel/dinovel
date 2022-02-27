import { declareComponent } from 'dinovel/render/declare.ts';
import { appStore } from "../../store/store.ts";
import { navTo } from '../../store/_nav.ts';

export const NavLink = declareComponent({
  template: /*html*/`<li class="nav-link" @click="nav">{{text}}</li>`,
  props: {
    text: {
      type: String,
      default: 'Go to...',
    },
    viewName: {
      type: String,
      required: true,
    }
  },
  methods: {
    nav() {
      appStore.dispatch(navTo(this.viewName));
    }
  }
});
