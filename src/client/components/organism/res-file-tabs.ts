import { declareComponent } from 'dinovel/render/declare.ts';
import { computedStore, obs } from 'dinovel/render/__.ts';
import { appStore } from '../../store/store.ts';
import { setActiveTab, closeTab } from '../../store/_resources.ts';
import { DnTabContainer } from 'dinovel/widgets/__.ts';
import { AssetRender } from '../atom/asset-render.ts';

const template = /*html*/`
<dn-tab-container
  class="resources-file-tabs"
  v-model="activeFileId"
  :tabs="tabs"
  :tabs-on-top="true"
  @tab-close="onTabClose"
>
  <template v-for="tab in tabs" :key="tab.id" #[tab.id]>
    <asset-render v-if="tab.type === 'file'" :path="tab.file" ></asset-render>
  </template>
</dn-tab-container>
`;

export const ResFileTabs = declareComponent({
  template,
  components: {
    DnTabContainer,
    AssetRender,
  },
  setup() {
    const activeFileId = computedStore(
      appStore,
      'resourcesView',
      setActiveTab,
      e => e.activeTab
    );

    const tabs = obs(appStore.select('resourcesView'), [], e => e.tabs);

    function onTabClose(id: string) {
      appStore.dispatch(closeTab(id));
    }

    return { activeFileId, tabs, onTabClose };
  }
});
