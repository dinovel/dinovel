import type { IValueObservable } from "../std/reactive/__.ts";
import type { App, ObservableOptions } from './vue-models.ts';

type Component = {
  components?: { [key: string]: Component | undefined };
  observable?: ObservableOptions;
}

export const VueObservable = {
  install(app: App) {
    app.config.globalProperties.$obs = {};
    app.mixin({
      created() {
        // deno-lint-ignore no-this-alias
        const target = this;
        const src = (this.$.type as Component).observable ?? {};
        Object.keys(src).forEach(key => {
          const obs = src[key]() as IValueObservable<unknown>;
          target[key] = obs.value;
          target.$obs[key] = obs.value;
          obs.subscribe({
            next(value) {
              target[key] = value;
              target.$obs[key] = value;
              target.$forceUpdate();
            }
          })
          target.$forceUpdate();
        });
      },
    })
  }
};
