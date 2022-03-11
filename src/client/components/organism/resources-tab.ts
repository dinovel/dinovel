import { declareComponent } from 'dinovel/render/declare.ts';
import { TabContainer, Tabs } from 'dinovel/widgets/__.ts';
import { ref } from 'vue';
import { ResFileExplorer } from '../molecule/res-file-explorer.ts';


const template = /*html*/`
<tab-container
  class="resources-view__tabs"
  :tabs="tabs"
  v-model="activeTabId"
>
  <template v-slot:res-list>
    Resources!
  </template>
  <template v-slot:file-list>
    <res-file-explorer></res-file-explorer>
  </template>
</tab-container>
`;

export const ResourcesTabs = declareComponent({
  template,
  components: {
    TabContainer,
    ResFileExplorer,
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
