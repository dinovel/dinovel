import { Render, VueObservable } from 'dinovel/render/__.ts';
import { App } from 'dinovel/render/vue-models.ts';
import { DinovelApp } from './app.ts';
import { initDinovel, injectLibs } from './services/__.ts';


class ClientRender extends Render {
  public constructor() {
    super(DinovelApp);
  }

  apply(app: App) {
    app.use(VueObservable);
  }

  async beforeMount() {
    await super.beforeMount();
    injectLibs();
    initDinovel();
  }

}

new ClientRender()
  .mount();
