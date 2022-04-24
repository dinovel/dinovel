import { Render, VueObservable, useStoreStorage } from 'dinovel/render/__.ts';
import { App } from 'dinovel/render/vue-models.ts';
import { useDynamicForm, DEFAULT_FORM_CONTROLS } from 'dinovel/forms/__.ts';
import { DinovelApp } from './app.ts';
import { initDinovel, injectLibs } from './services/__.ts';
import { appStore } from './store/store.ts';
import { APP_STORAGE_KEY } from "./core/constants.ts";
import { appEvents } from './events/app-events.ts';


class ClientRender extends Render {
  public constructor() {
    super(DinovelApp);
  }

  apply(app: App) {
    app.use(VueObservable);
    useDynamicForm(app, DEFAULT_FORM_CONTROLS);
  }

  async beforeMount() {
    await super.beforeMount();
    injectLibs();
    initDinovel();
  }

  afterMount() {
    super.afterMount();
    appEvents.emit('ready');
  }
}

useStoreStorage(appStore, APP_STORAGE_KEY);

new ClientRender()
  .mount();
