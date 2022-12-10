import { UIElement } from './ui-element.ts';
import { ILogger, ILoggerFactory } from '../logger/mod.ts';
import { createTypeStyle } from 'npm:typestyle';

export type UIElementLoader = UIElement | (() => Promise<UIElement> | UIElement);

export interface IUIStore {
  has: (name: string) => boolean;
  register: (element: UIElementLoader, overwrite?: boolean) => Promise<boolean>;
  load: () => Promise<void>;
}

export class UIStore implements IUIStore {
  #elems: Map<string, UIElementLoader> = new Map();
  #logger: ILogger;
  #loaded = false;

  constructor(logFactory: ILoggerFactory) {
    this.#logger = logFactory.createLogger('UIStore');
  }

  has(name: string) {
    return this.#elems.has(name);
  }

  async register(element: UIElementLoader, overwrite = false) {
    if (this.#elems.has(element.name) && !overwrite) {
      const error = new Error(`Element "${element.name}" is already registered`);
      this.#logger.error(error.message, error);
      throw error;
    }

    if (this.#elems.has(element.name)) {
      this.#logger.warn(`Element "${element.name}" is already registered, overwriting`);
    }

    this.#elems.set(element.name, element);

    if (this.#loaded) {
      return await this.#loadElement(element);
    }

    return false;
  }

  async load() {
    if (this.#loaded) return;

    this.#logger.info('Loading UI elements');
    for (const e of this.#elems.values()) {
      try {
        this.#logger.debug(`Loading element "${e.name}"`);
        const isLoaded = await this.#loadElement(e);
        this.#logger.debug(`Element "${e.name}" loaded: ${isLoaded}`);
      } catch (err) {
        this.#logger.error(`Error loading element "${e.name}"`, err);
      }
    }
  }

  async #loadElement(element: UIElementLoader): Promise<boolean> {
    const e = typeof element === 'function' ? await element() : element;

    let shouldLoad = true;
    if (e.beforeLoad) shouldLoad = await e.beforeLoad();
    if (!shouldLoad) return false;

    const baseClass = e.extends ?? HTMLElement;

    const customAttrSet = new Set(getObservedAttr(baseClass));
    if (e.attributes) {
      for (const [key, value] of Object.entries(e.attributes)) {
        if (value === true || typeof value === 'function') {
          customAttrSet.add(key);
        }
      }
    }
    const customAttr = [...customAttrSet];

    customElements.define(
      e.name,
      class extends baseClass {
        static get observedAttributes() {
          return customAttr;
        }

        constructor() {
          super();
          const shadowRoot = this.attachShadow({ mode: 'open' });

          if (e.styles) {
            const typeStyle = createTypeStyle();
            for (const [name, style] of Object.entries(e.styles)) {
              typeStyle.cssRule(name, style);
            }

            const styleElem = document.createElement('style');
            styleElem.textContent = typeStyle.getStyles();
            shadowRoot.appendChild(styleElem);
          }

          if (e.template) {
            const templateId = `template-${e.name}`;
            const template = document.createElement('template');
            template.id = templateId;
            template.innerHTML = e.template;
            document.body.appendChild(template);

            const customTemplate = document.getElementById(templateId) as HTMLTemplateElement;
            shadowRoot.appendChild(customTemplate.content.cloneNode(true));
          }

          if (e.init) {
            e.init(this, shadowRoot);
          }
        }

        connectedCallback() {
          this.#callSuper('connectedCallback');
          if (e.connectedCallback && this.isConnected) {
            e.connectedCallback(this);
          }
        }

        disconnectedCallback() {
          this.#callSuper('disconnectedCallback');
          if (e.disconnectedCallback) {
            e.disconnectedCallback(this);
          }
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
          this.#callSuper('attributeChangedCallback', name, oldValue, newValue);
          if (e.attributeChangedCallback) {
            e.attributeChangedCallback(this, name, oldValue, newValue);
          }

          if (e.attributes && e.attributes[name]) {
            const observer = e.attributes[name];
            if (typeof observer === 'function') {
              observer(this, oldValue, newValue);
            }
          }
        }

        #callSuper(name: string, ...args: unknown[]) {
          const key = name as keyof HTMLElement;
          if (typeof super[key] === 'function') {
            (super[key] as (...args: unknown[]) => void)(...args);
          }
        }
      },
    );

    return true;
  }
}

function getObservedAttr(target: unknown): string[] {
  const attr: string[] = [];

  if (typeof target === 'function') {
    const toAdd = target['observedAttributes' as keyof typeof target];
    if (Array.isArray(toAdd)) {
      attr.push(...toAdd);
    }
  }

  return attr;
}
