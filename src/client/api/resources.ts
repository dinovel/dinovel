import { ref } from 'vue';
import { ResourceState } from 'dinovel/server/modules/resources/models.ts';
import { Ref } from "dinovel/render/vue-models.ts";
import { BaseApi } from "./base-api.ts";
import { appStore } from '../store/store.ts';
import { setStatusLoading, setStatusReady, setStatusError } from '../store/_loading.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';

export class ResourcesApi extends BaseApi {
  constructor(baseUrl: string = '') {
    super(baseUrl + "/api/resources");
  }

  /** Return list of project resources */
  async loadResources() { return await this.GET<ResourceState>("/"); }

  /** Create REF for ResourceState */
  mapResources(): [Ref<ResourceState | undefined>, () => Promise<void>] {
    const state = ref() as Ref<ResourceState | undefined>;
    const load = async () => {
      appStore.dispatch(setStatusLoading());
      try {
        const res = await this.loadResources();
        state.value = res;
        appStore.dispatch(setStatusReady());
      }
      catch (e) {
        state.value = undefined;
        Dinovel.logger.error('Error loading ', e);
        appStore.dispatch(setStatusError('Error loading resources'));
      }
    };
    return [state, load];
  }
}
