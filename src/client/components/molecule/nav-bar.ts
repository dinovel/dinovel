import { declareComponent } from 'dinovel/render/declare.ts';
import type { RouterLink } from '../../router/app-router.ts';
import { NavLink } from '../atom/nav-link.ts';

export const NavBar = declareComponent({
  template: /*html*/`<ul class="nav-bar">
  <nav-link v-for="view in views" :text="view.text" :view-name="view.name"></nav-link>
</ul>`,
  props: {
    views: {
      type: Array,
      default: [] as RouterLink[],
    },
  },
  components: { NavLink },
});
