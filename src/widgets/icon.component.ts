import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { DnDefaultIconList } from './icons/__.ts';
import { computed } from 'vue';
import { Dinovel } from "dinovel/engine/dinovel.ts";

export class IconList {
  private _icons: { [key: string]: string } = {};

  constructor() {}

  public get(key: string): string {
    return this._icons[key];
  }

  public set(key: string, value: string): void {
    this._icons[key] = value;
  }

  public getAll(): { [key: string]: string } {
    return this._icons;
  }

  public setAll(icons: { [key: string]: string }): void {
    this._icons = icons;
  }

  public merge(icons: { [key: string]: string }): void {
    this._icons = { ...this._icons, ...icons };
  }
}

export const DnIconList = new IconList();
DnIconList.merge(DnDefaultIconList);

const template = /*html*/`<span class="dn-icon" v-html="iconSVG" ></span>`;

export const DnIcon = declareComponent({
  template,
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const iconSVG = computed(() => {
      const value = DnIconList.get(props.icon);

      if (!value) {
        Dinovel.logger.error(`Icon "${props.icon}" not found.`);
      }

      return value ?? DnIconList.get('default') ?? '';
    });

    return {
      iconSVG,
    };
  },
});

export default {
  component: DnIcon,
  tagName: 'dn-icon',
  description: 'Show an icon, using the icon list',
  usageTemplate: /*html*/`
<dn-icon icon="file"></dn-icon>
`
} as ComponentDeclaration;
