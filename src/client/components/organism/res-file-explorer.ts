import { declareComponent } from 'dinovel/render/declare.ts';
import { DirHierarchy } from '../molecule/dir-hierarchy.ts';
import { Ref } from 'dinovel/render/vue-models.ts';
import { ref } from 'vue';
import { appStore } from '../../store/store.ts';
import { addFileTab } from '../../store/_resources.ts';

const template = /*html*/`
  <dir-hierarchy
    :entries="files"
    @file-click="onFileClick"
  ></dir-hierarchy>
`;

export const ResFileExplorer = declareComponent({
  template,
  components: { DirHierarchy },
  setup() {
    // deno-lint-ignore no-explicit-any
    const files: Ref<any> = ref({});

    appStore.select('resourcesView')
      .subscribe(s => files.value = s.resources.files ?? {} );

    function onFileClick(path: string) {
      appStore.dispatch(addFileTab(path));
    }

    return { files, onFileClick };
  },
});
