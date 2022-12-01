import type { types } from 'npm:typestyle';

export interface UIElement {
  name: string;

  beforeLoad?: () => boolean | Promise<boolean>;

  template?: string;

  styles?: Record<string, types.NestedCSSProperties>;

  init?: (element: HTMLElement, shadowDom: ShadowRoot) => void;
  connectedCallback?: (element: HTMLElement) => void;
  disconnectedCallback?: (element: HTMLElement) => void;
  attributeChangedCallback?: (element: HTMLElement, name: string, oldValue: string, newValue: string) => void;
  attributes?: { [key: string]: ((element: HTMLElement, oldValue: string, newValue: string) => void) | boolean };

  extends?: new () => HTMLElement;
}
