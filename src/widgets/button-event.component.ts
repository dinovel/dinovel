import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';

const template = /*html*/`
<button
  class="dn-button dn-button--event"
  :disabled="disabled"
  @click="onClick"
>{{ text }}</button>
`;

export const EventButton = declareComponent({
  template,
  props: {
    text: {
      type: String,
      default: 'Trigger Event',
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
    }
  },
  methods: {
    onClick() {
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
