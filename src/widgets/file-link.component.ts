import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { DnIcon } from './icon.component.ts';

const template = /*html*/`
<a class="dn-file-link" @click="onClick" >
  <span class="dn-file-link-icon"><dn-icon :icon="iconName" /></span>
  <span class="dn-file-link-text">{{ name }}</span>
</a>`;

export const DnFileLink = declareComponent({
  template,
  components: { DnIcon },
  props: {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { emit }) {
    let iconName = props.icon;
    if (!iconName) {
      const ext = props.path.split('.').pop() ?? '';
      console.warn(`FileLink: no icon found for extension "${ext}"`);
      if (['mp3', 'ogg', 'flac'].includes(ext)) { iconName = 'fileMusic'; }
      else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) { iconName = 'fileImage'; }
      else if (['mp4', 'webm'].includes(ext)) { iconName = 'fileVideo'; }
      else { iconName = 'file'; }
    }

    function onClick() {
      emit('link-press', props.path);
    }

    return { iconName, onClick };
  }
});

export default {
  component: DnFileLink,
  tagName: 'dn-file-link',
  description: 'Show a file link, icon is automatically determined',
  usageTemplate: /*html*/`
<dn-file-link name="my-image" path="/img/my-image.png"></dn-file-link>
<dn-file-link name="file" path="/file.pdf" icon="pdf"></dn-file-link>
`
} as ComponentDeclaration;
