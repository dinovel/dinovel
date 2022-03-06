import { declareComponent } from 'dinovel/render/declare.ts';
import { TabContainer, Tabs } from 'dinovel/widgets/__.ts';
import { ref } from 'vue';
import { appEvents } from '../events/app-events.ts';
import { ResFileExplorer } from '../components/organism/res-file-explorer.ts';

const template = /*html*/`
<div class="resources-view">
  <tab-container
    class="resources-view__tabs"
    :tabs="tabs"
    v-model="activeTabId"
  >
    <template v-slot:res-list>
      <div class="resources-view__tab-content">
        Resources!
      </div>
    </template>
    <template v-slot:file-list>
      <res-file-explorer></res-file-explorer>
    </template>
  </tab-container>
  <tab-container
    class="resources-view__content"
    :tabs="files"
    v-model="activeFileId"
    :use-default-tab="true"
    :tabs-on-top="true"
  >
    <div class="resources-view__content-container">
      file content here
    </div>
  </tab-container>
</div>
`;

export const ResourcesView = declareComponent({
  template,
  components: {
    TabContainer,
    ResFileExplorer,
  },
  setup() {

    const activeTabId = ref('file-list');
    const activeFileId = ref('');

    const tabs = ref([{
      id: 'res-list',
      name: 'Resources',
    },{
      id: 'file-list',
      name: 'File Explorer',
    }] as Tabs);

    const files = ref([{
      id: '1',
      name: 'someFileName.jpg',
    }, {
      id: '2',
      name: 'anotherFile.mp4',
    }] as Tabs);

    return { tabs, activeTabId, files, activeFileId };
  },
  mounted() {
    appEvents.emit('refreshResources');
  },
});
