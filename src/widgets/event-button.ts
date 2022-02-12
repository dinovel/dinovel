import {
  Definition,
  Element,
  globalRegistry,
  h,
  RenderResult,
  stringAttr,
} from 'dinovel/render/__.ts';

export const EventButtonProps = {
  text: stringAttr('text', 'Trigger Event'),
}

export class EventButton extends Element<typeof EventButtonProps> {

  protected render(): RenderResult | Promise<RenderResult> {
    const button = h<HTMLButtonElement>(
      `<button>${this.props.text}</button>`,
    );

    button.addEventListener('click', () => {
      console.log('Button clicked');
    });

    return button;
  }

}

export const EventButtonDef: Definition = {
  tagName: 'dn-event-button',
  description: 'A button that triggers an event',
  constructor: EventButton,
  attributes: EventButtonProps,
};

globalRegistry.register(EventButtonDef);
