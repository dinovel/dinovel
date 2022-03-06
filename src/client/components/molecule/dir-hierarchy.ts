import { declareComponent } from 'dinovel/render/declare.ts';
import { DnFileLink } from 'dinovel/widgets/__.ts';
import { computed } from 'vue';

const template = /*html*/`
<div class="dn-dir-hierarchy">
  <div class="dn-dir-hierarchy__files">
    <dn-file-link
      v-for="file in files"
      :name="file[0]"
      :path="file[1]"
    ></dn-file-link>
  </div>
</div>
`;

export const DirHierarchy = declareComponent({
  props: {
    entries: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { DnFileLink },
  template,
  setup(props) {
    const files = computed(() => Object
      .entries(props.entries)
      .filter(e => typeof e[1] === 'string')
    );

    const folders = computed(() => Object
      .values(props.entries).filter(e => typeof e === 'object'));

    return { files, folders };
  }
});
