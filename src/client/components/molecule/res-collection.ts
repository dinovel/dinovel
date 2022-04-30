import { declareComponent } from 'dinovel/render/declare.ts';
import { DnButtonEvent } from 'dinovel/widgets/__.ts';
import { DirHierarchy } from '../atom/dir-hierarchy.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { Ref } from 'dinovel/render/vue-models.ts';
import { ref } from 'vue';
import { appStore } from '../../store/store.ts';
import { addResourceGroup } from "../../store/_resources.ts";

const template = /*html*/`
<div class="dn-res-collection">
  <div class="dn-res-collection__top-bar">
    <dn-button-event
      class="dn-button--simple"
      event="noop"
      icon="folderPlus"
      @click="addNewGroup"
    ></dn-button-event>
  </div>
  <div class="dn-res-collection__groups">
    <dir-hierarchy
      :entries="appResources"
      @file-click="onResourceClick"
    ></dir-hierarchy>
  </div>
</div>
`;

export const ResCollection = declareComponent({
  template,
  components: {
    DnButtonEvent,
    DirHierarchy,
  },
  setup() {
    // deno-lint-ignore no-explicit-any
    const appResources: Ref<any> = ref({});

    appStore.select('resourcesView', r => {
      appResources.value = r.resources.resMap ?? {}
    });

    function addNewGroup() {
      const dialog = Dinovel.dialogs.open('prompt', {
        closable: true,
        title: 'New Resource Group',
      });
      const sub = dialog.subscribe(r => {
        if (!r.hasValue) return;
        appStore.dispatch(addResourceGroup(r.value));
        dialog.unsubscribe(sub);
      });
    }

    function onResourceClick() {

    }

    return {
      addNewGroup,
      appResources,
      onResourceClick,
    };
  }
});
