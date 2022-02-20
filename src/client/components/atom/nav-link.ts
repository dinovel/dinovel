import { declareComponent } from 'dinovel/render/declare.ts';
import { events } from '../../core/events.ts';

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
      events.emit('nav', this.viewName);
    }
  }
});
