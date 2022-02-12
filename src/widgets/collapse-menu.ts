import { Dinovel } from 'dinovel/engine/dinovel.ts';
import {
  arrayAttr,
  Definition,
  Element,
  globalRegistry,
  h,
  RenderResult,
  stringAttr,
} from 'dinovel/render/__.ts';

import { MenuItem } from './_models.ts';

// deno-lint-ignore no-explicit-any
const eventHandler = Dinovel.events.for<any>();

export const CollapseMenuProps = {
  label: stringAttr('label', 'Menu'),
  items: arrayAttr<MenuItem>('items', []),
  pos: stringAttr('pos', 'topRight'),
}

export class CollapseMenu extends Element<typeof CollapseMenuProps> {
  private _menu?: HTMLDivElement;

  protected override onAfterRender(): void {
    this.updateMenuPosition();
  }

  protected render(): RenderResult | Promise<RenderResult> {
    const menu = h<HTMLDivElement>(/*html*/`<div class="dn-collapse-menu ${this.props.pos}"></div>`);

    const { left, top, right, bottom } = this.calculateMenuPosition();
    menu.style.left = left;
    menu.style.top = top;
    menu.style.right = right;
    menu.style.bottom = bottom;
    menu.style.position = 'fixed';

    const toggleButton = h<HTMLDivElement>(/*html*/`<div class="menu-button">${this.props.label}</div>`);
    toggleButton.addEventListener('click', () => this.updateMenuPosition());

    const menuItems = this.props.items.map(item => this.buildItem(item));
    const container = h<HTMLDivElement>(/*html*/`<div class="menu-items"></div>`);
    menuItems.forEach(item => container.appendChild(item));

    const { isTop } = this.calculateMenuPosition();
    if (isTop) {
      menu.appendChild(container);
      menu.appendChild(toggleButton);
    } else {
      menu.appendChild(toggleButton);
      menu.appendChild(container);
    }

    this._menu = menu;
    return menu;
  }

  private buildItem(item: MenuItem): HTMLDivElement {
    const elem = h<HTMLDivElement>(/*html*/`
  <div class="menu-item">
    <div class="menu-item-icon">${item.icon || ''}</div>
    <div class="menu-item-label">${item.label}</div>
  `);

    elem.addEventListener('click', () => {
      eventHandler.emit(item.event);
    });

    return elem;
  }

  private calculateMenuPosition() {
    const pos = this.props.pos.toLowerCase();
    const isLeft = pos.includes('left');
    const isTop = pos.includes('top');

    return {
      left: isLeft ? '15px' : 'auto',
      top: isTop ? '0' : 'auto',
      right: isLeft ? 'auto' : '15px',
      bottom: isTop ? 'auto' : '0',
      isLeft,
      isTop,
    }
  }

  private updateMenuPosition(): void {
    if (!this._menu) { return; }

    const isOpen = !this._menu.classList.toggle('collapsed');
    if (isOpen) { this.openMenu(this._menu); }
    else { this.closeMenu(this._menu); }
  }

  private openMenu(menu: HTMLDivElement): void {
    const { isTop } = this.calculateMenuPosition();
    menu.style.top = isTop ? '0' : 'auto';
    menu.style.bottom = isTop ? 'auto' : '0';
  }

  private closeMenu(menu: HTMLDivElement): void {
    const totalHeight = menu.scrollHeight;
    const btnHeight = menu.querySelector('.menu-button')?.clientHeight || 0;
    const { isTop } = this.calculateMenuPosition();

    const pos = -1 * (totalHeight - btnHeight);
    menu.style.top = isTop ? `${pos}px` : 'auto';
    menu.style.bottom = isTop ? 'auto' : `${pos}px`;
  }
}

export const CollapseMenuDef: Definition = {
  tagName: 'dn-collapse-menu',
  constructor: CollapseMenu,
  attributes: CollapseMenuProps,
  description: 'A menu that can be collapsed',
  skipDocs: true,
};

globalRegistry.register(CollapseMenuDef);
