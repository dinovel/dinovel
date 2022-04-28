import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { ButtonEventProps, DnButtonEvent } from './button-event.component.ts';
import { DnIcon } from './icon.component.ts';
import { computed } from 'vue';
import { PropType } from "dinovel/render/vue-models.ts";

const template = /*html*/`
<div
  class="dn-dialog"
  :class="classNames"
>
  <div
    class="dn-dialog__container"
    :style="{ width: width, height: height }"
  >
    <div v-if="!hasHeader" class="dn-dialog__header">
      <dn-icon
        v-if="icon"
        class="dn-dialog__icon"
        :icon="icon"
      ></dn-icon>
      <div v-if="title" class="dn-dialog__title">{{ title }}</div>
      <dn-icon
        v-if="closable"
        class="dn-dialog__close"
        icon="xCircle"
        @click="closeDialog"
      ></dn-icon>
    </div>
    <div v-else class="dn-dialog__header">
      <slot name="header"></slot>
    </div>
    <div class="dn-dialog__body">
      <slot></slot>
    </div>
    <div v-if="!hasFooter && footerBtns.length" class="dn-dialog__footer">
      <dn-button-event
        v-for="(action, index) in footerBtns"
        :key="index"
        :event="action.event"
        :icon="action.icon"
        :text="action.text"
        :eventData="action.eventData"
        :disabled="action.disabled || action.disabledFn"
      ></dn-button-event>
    </div>
    <div v-else-if="hasFooter" class="dn-dialog__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</div>
`;

export const DnDialog = declareComponent({
  template,
  components: { DnButtonEvent, DnIcon },
  props: {
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    closable: {
      type: Boolean,
      default: true,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<ButtonEventProps[]>,
      default: () => [],
    },
  },
  setup(props, { emit, slots }) {
    const classNames = computed(() => ({
      'dn-dialog--fixed': props.fixed,
      'dn-dialog--modal': props.modal,
    }));

    function closeDialog() { emit('close'); }

    const hasHeader = computed(() => !!slots.header);
    const hasFooter = computed(() => !!slots.footer);

    const footerBtns = computed(() => props.actions.map(e => ({
      ...e,
      disabledFn: computed(() => !!(e.disabledFn && e.disabledFn())),
    })))

    return { classNames, closeDialog, hasHeader, hasFooter, footerBtns };
  }
});

export default {
  component: DnDialog,
  tagName: 'dn-dialog',
  description: 'A dialog',
  usageTemplate: /*html*/`
<dn-dialog :title="My dialog">
  <div>
    <p>Some content</p>
  </div>
  <template v-slot:footer>
    a footer
  </template>
</dn-dialog>
`,
} as ComponentDeclaration;
