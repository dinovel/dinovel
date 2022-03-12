import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { DnIcon } from './icon.component.ts';

const template = /*html*/`
<button
  class="dn-button dn-button--event"
  :disabled="disabled"
  @click="onClick"
>
  <dn-icon v-if="icon" class="dn-button__icon" :icon="icon"></dn-icon>
  <span v-if="text" class="dn-button__text">{{ text }}</span>
</button>
`;

export const EventButton = declareComponent({
  template,
  components: { DnIcon },
  props: {
    text: {
      type: String,
      default: '',
    },
    event: {
      type: String,
      required: true,
    },
    eventData: {
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    }
  },
  methods: {
    onClick() {
      if (this.disabled) return;
      // deno-lint-ignore no-explicit-any
      Dinovel.events.for<any>().emit(this.event, this.eventData);
    }
  }
});

export default {
  component: EventButton,
  tagName: 'dn-button-event',
  description: 'A button that triggers an event',
  usageTemplate: /*html*/`
<h3>Default button for events</h3>
<dn-button-event event="alert" text="Click Me" event-data="You click the button" ></dn-button-event>

<h3>Button with disabled state</h3>
<dn-button-event disabled="true"></dn-button-event>
`
} as ComponentDeclaration;
