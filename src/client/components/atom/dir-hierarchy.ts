import { declareComponent } from 'dinovel/render/declare.ts';
import { DnFileLink, DnAccordion } from 'dinovel/widgets/__.ts';
import { computed } from 'vue';

const template = /*html*/`
<div class="dn-dir-hierarchy">
  <div class="dn-dir-hierarchy__files">
    <dn-file-link
      v-for="file in files"
      :name="file[0]"
      :path="file[1]"
      @click="onFileClick(file[1])"
    ></dn-file-link>
  </div>
  <div class="dn-dir-hierarchy__folders">
    <dn-accordion v-for="folder in folders" :title="folder[0]">
      <template v-slot:body>
        <dn-dir-hierarchy
          :entries="folder[1]"
          @file-click="onFileClick"
        ></dn-dir-hierarchy>
      </template>
    </dn-accordion>
  </div>
</div>
`;

export const DirHierarchy = declareComponent({
  name: 'DnDirHierarchy',
  props: {
    entries: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { DnFileLink, DnAccordion },
  template,
  setup(props, { emit }) {
    const files = computed(() => Object
      .entries(props.entries)
      .filter(e => typeof e[1] === 'string')
    );

    const folders = computed(() => Object
      .entries(props.entries)
      .filter(e => typeof e[1] === 'object'));

    function onFileClick(path: string) {
      emit('file-click', path);
    }

    return { files, folders, onFileClick };
  }
});
