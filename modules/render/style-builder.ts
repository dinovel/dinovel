import { cssRule, types } from 'npm:typestyle';
import { normalize } from 'npm:csstips';
import { createLogger } from '../logger/mod.ts';

export interface IStylePlugin {
  active?: boolean;
  apply: (style: types.NestedCSSProperties) => types.NestedCSSProperties;
}

export type IStyle = types.NestedCSSProperties | IStylePlugin;

export interface IStyleBuilder {
  importStyle: (style: IStyle) => void;
  normalize: (status?: boolean) => void;
  render: () => void;
}

export class StyleBuilder implements IStyleBuilder {
  #rootStyles: Map<number, IStyle[]> = new Map();
  #active = false;
  #normalize = false;
  #logger = createLogger('StyleBuilder');

  importStyle(style: IStyle, order = 0): this {
    const list = this.#rootStyles.get(order) ?? [];
    list.push(style);
    this.#rootStyles.set(order, list);

    if (this.#active) {
      this.render();
    }

    return this;
  }

  normalize(status = true) {
    if (this.#active) {
      this.#logger.warn('Cannot change normalize after render');
    }

    this.#normalize = status;
    return this;
  }

  render() {
    if (!this.#active && this.#normalize) {
      normalize();
    }

    this.#active = true;
    const rootStyle = this.#build();
    cssRule('html, body', rootStyle);
  }

  #build() {
    const orders = Array.from(this.#rootStyles.keys()).sort();
    let rootStyle: types.NestedCSSProperties = {};
    for (const order of orders) {
      const stylesToApply = this.#rootStyles.get(order) ?? [];
      for (const style of stylesToApply) {
        if (!isStylePlugin(style)) {
          rootStyle = { ...rootStyle, ...style };
          continue;
        }

        if (style.active === false) continue;
        try {
          rootStyle = style.apply(rootStyle);
        } catch (error) {
          this.#logger.warn(`Failed to apply style plugin: ${error.message}`);
        }
      }
    }
    return rootStyle;
  }
}

function isStylePlugin(style: IStyle): style is IStylePlugin {
  return 'apply' in style && typeof style.apply === 'function';
}
