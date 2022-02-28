import { declareComponent } from 'dinovel/render/declare.ts';
import { APP_STORAGE_KEY } from '../../core/constants.ts';

export const ButtonReset = declareComponent({
  template: /*html*/`<button class="dn-button dn-button--secondary" @click="reset">Reset</button>`,
  methods: {
    reset() {
      localStorage.removeItem(APP_STORAGE_KEY);
      location.reload();
    }
  }
});
