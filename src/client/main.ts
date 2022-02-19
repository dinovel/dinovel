import { App } from './app.ts';
import { Render } from 'dinovel/render/render.ts';
import { initDinovel } from './services/__.ts';

class ClientRender extends Render {
  public constructor() {
    super(App);
  }

  async beforeMount() {
    await super.beforeMount();
    initDinovel();
  }
}

new ClientRender()
  .mount();
