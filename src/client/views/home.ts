import { declareComponent } from 'dinovel/render/declare.ts';
import { DnWidgets } from 'dinovel/widgets/__.ts';

const template = /*html*/`<div>
  <dn-button-event text="Resources" event="nav" event-data="resources" ></dn-button-event>
</div>`;

export const HomeView = declareComponent({
  template,
  components: {
    ...DnWidgets
  }
});
