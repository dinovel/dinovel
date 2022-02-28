import { Render, VueObservable, useStoreStorage } from 'dinovel/render/__.ts';
import { App } from 'dinovel/render/vue-models.ts';
import { DinovelApp } from './app.ts';
import { initDinovel, injectLibs } from './services/__.ts';
import { appStore } from './store/store.ts';
import { APP_STORAGE_KEY } from "./core/constants.ts";


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

useStoreStorage(appStore, APP_STORAGE_KEY);

new ClientRender()
  .mount();
