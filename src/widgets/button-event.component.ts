import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { DnIcon } from './icon.component.ts';

export interface ButtonEventProps {
  event: string;
  icon?: string;
  text?: string;
  // deno-lint-ignore no-explicit-any
  eventData?: any;
  disabled?: boolean;
  disabledFn?: () => boolean;
}

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

export const DnButtonEvent = declareComponent({
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
  component: DnButtonEvent,
  tagName: 'dn-button-event',
  description: 'A button that triggers an event',
  usageTemplate: /*html*/`
<h3>Default button for events</h3>
<dn-button-event event="alert" text="Click Me" event-data="You click the button" ></dn-button-event>

<h3>Button with icon</h3>
<dn-button-event event="alert" icon="xClose" event-data="You click the button" ></dn-button-event>
<dn-button-event event="alert" icon="xClose" text="Close" event-data="You click the button" ></dn-button-event>

<h3>Button with disabled state</h3>
<dn-button-event disabled="true"></dn-button-event>
`
} as ComponentDeclaration;
