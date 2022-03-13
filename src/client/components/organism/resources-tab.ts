import { declareComponent } from 'dinovel/render/declare.ts';
import { DnTabContainer, Tabs } from 'dinovel/widgets/__.ts';
import { ref } from 'vue';
import { ResFileExplorer } from '../molecule/res-file-explorer.ts';
import { ResCollection } from '../molecule/res-collection.ts';


const template = /*html*/`
<dn-tab-container
  class="resources-view__tabs"
  :tabs="tabs"
  v-model="activeTabId"
>
  <template v-slot:res-list>
    <res-collection></res-collection>
  </template>
  <template v-slot:file-list>
    <res-file-explorer></res-file-explorer>
  </template>
</dn-tab-container>
`;

export const ResourcesTabs = declareComponent({
  template,
  components: {
    DnTabContainer,
    ResFileExplorer,
    ResCollection,
  },
  setup() {
    const activeTabId = ref('res-list');

    const tabs = ref([{
      id: 'res-list',
      name: 'Resources',
    },{
      id: 'file-list',
      name: 'File Explorer',
    }] as Tabs);

    return { tabs, activeTabId };
  }
});
