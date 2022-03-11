import { declareComponent } from 'dinovel/render/declare.ts';
import { appEvents } from '../events/app-events.ts';
import { ResFileTabs } from '../components/organism/res-file-tabs.ts';
import { ResourcesTabs } from '../components/organism/resources-tab.ts';

const template = /*html*/`
<div class="resources-view">
  <resources-tabs
    class="resources-view__tabs"
  ></resources-tabs>
  <res-file-tabs
    class="resources-view__content"
  ></res-file-tabs>
</div>
`;

export const ResourcesView = declareComponent({
  template,
  components: {
    ResourcesTabs,
    ResFileTabs,
  },
  mounted() {
    appEvents.emit('refreshResources');
  },
});
