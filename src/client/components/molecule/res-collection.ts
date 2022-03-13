import { declareComponent } from 'dinovel/render/declare.ts';
import { DnButtonEvent } from 'dinovel/widgets/__.ts';

interface ButtonItem {
  event: string;
  icon: string;
  enabled: boolean;
}

const template = /*html*/`
<div class="dn-res-collection">
  <div class="dn-res-collection__top-bar">
    <dn-button-event
      class="dn-button--simple"
      v-for="(item, index) in items"
      :key="index"
      :event="item.event"
      :icon="item.icon"
      :disabled="!item.enabled"
    ></dn-button-event>
  </div>
</div>
`;

export const ResCollection = declareComponent({
  template,
  components: { DnButtonEvent },
  setup() {

    const items: ButtonItem[] = [
      {
        event: 'removeResourcegroup',
        icon: 'folderMinus',
        enabled: false,
      },
      {
        event: 'addNewResourcegroup',
        icon: 'folderPlus',
        enabled: true,
      },
    ];

    return { items };
  }
});
