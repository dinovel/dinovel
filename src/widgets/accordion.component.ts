import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { DnIcon } from './icon.component.ts';
import { ref } from 'vue';

const template = /*html*/`
<div class="dn-accordion">
  <div class="dn-accordion__header" @click="onClick">
    <span class="dn-accordion__header-icon">
      <dn-icon v-if="isOpen" :icon="iconNameOpen" />
      <dn-icon v-else :icon="iconNameClosed" />
    </span>
    <span class="dn-accordion__header-content">
      <span class="dn-accordion__header-content-text" v-if="title" >{{ title }}</span>
      <slot v-else name="header"></slot>
    </span>
  </div>
  <div class="dn-accordion__body" v-if="isOpen">
    <slot name="body"></slot>
  </div>
</div>
`;

export const DnAccordion = declareComponent({
  template,
  components: { DnIcon },
  props: {
    iconNameOpen: {
      type: String,
      default: 'chevronDown',
    },
    iconNameClosed: {
      type: String,
      default: 'chevronRight',
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(_, { emit }) {
    const isOpen = ref(false);

    const onClick = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        emit('open');
      } else {
        emit('close');
      }
    };

    return {
      isOpen,
      onClick,
    };
  }
});

export default {
  component: DnAccordion,
  tagName: 'dn-accordion',
  description: 'Accordion component that can be used to display a group of items in a collapsible manner.',
  usageTemplate: /*html*/`
<dn-accordion>
  <div slot="header">
    my custom header
  </div>
  <div slot="body">
    my custom body
  </div>
</dn-accordion>
`
} as ComponentDeclaration;
