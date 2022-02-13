import { declareComponent } from 'dinovel/render/declare.ts';

const template = /*html*/`<div>{{ message }}</div>`;

export const home = declareComponent({
  template,
  data() {
    return {
      message: 'Hello World!',
    }
  }
});
