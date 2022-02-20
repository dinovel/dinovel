import { Render } from 'dinovel/render/render.ts';
import { DinovelApp } from './app.ts';
import { initDinovel } from './services/__.ts';


class ClientRender extends Render {
  public constructor() {
    super(DinovelApp);
  }

  async beforeMount() {
    await super.beforeMount();
    initDinovel();
  }

}

new ClientRender()
  .mount();
