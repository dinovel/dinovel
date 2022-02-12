import {
  debounce,
  Subject,
} from 'dinovel/std/reactive/__.ts';

import { AttributeBag } from './attribute-bag.ts';
import {
  Attribute,
  AttributeMap,
  Definition,
  RenderResult,
} from './models.ts';

/** Base class for custom web components */
export abstract class Element<T> extends HTMLElement {
  public readonly props: AttributeMap<T>;
  private readonly __renderSubject = new Subject<void>();
  private readonly __shadowRoot?: ShadowRoot;
  private readonly __attributeBag: AttributeBag;

  constructor(useShadowDom = false) {
    super();
    this.__attributeBag = this.__initBag();
    this.props = this.__attributeBag.initMap();
    if (useShadowDom) {
      this.__shadowRoot = this.attachShadow({ mode: 'open' });
    }

    this.__renderSubject
      .pipe(debounce(50))
      .subscribe({ next: () => this.__applyRender() });
  }

  /** Triggers a new render of the view */
  public triggerRender(): void {
    this.__renderSubject.next();
  }

  // --------------------------------------- PRIVATE --------------------------------------- //
  /** Render content to child */
  private async __applyRender(): Promise<void> {
    await this.onBeforeRender();
    const render = this.render();
    const result = render instanceof Promise ? await render : render;
    if (!result) return;
    const toRender: Node[] = Array.isArray(result) ? result : [result];
    if (!this.isConnected) return;

    // Clear previous content
    while (this.target.firstChild) {
      this.target.removeChild(this.target.firstChild);
    }

    for (const elem of toRender) {
        this.target.appendChild(elem);
    }
    this.onAfterRender();
  }

  /** Target where to render content */
  private get target(): ShadowRoot | HTMLElement {
    return this.__shadowRoot ?? this;
  }

  /** Global set properties */
  private get attrMap() {
    const target = this.constructor as unknown as typeof Element;
    return target.attributes;
  }

  /** initialize property bags */
  private __initBag(): AttributeBag {
    const bag = new AttributeBag(this, this.attrMap);
    bag.onChange.subscribe({ next: () => this.triggerRender() });
    return bag;
  }

  // --------------------------------------- OVERRIDABLE ------------------------------------ //

  /** Render logic for current component */
  protected abstract render(): RenderResult | Promise<RenderResult>;

  /** Runs after connectedCallback */
  protected onMount(): void | Promise<void> {}

  /** Runs after disconnectedCallback */
  protected onUnmount(): void | Promise<void> {}

  /** Runs before render starts */
  protected onBeforeRender(): void | Promise<void> {}

  /** Runs after render ends */
  protected onAfterRender(): void | Promise<void> {}

  // --------------------------------------- SYSTEM CALL ------------------------------------ //

  /** System call for when any attribute changes */
  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.__attributeBag.valueChanged(name, oldValue, newValue);
  }

  /** System call for when component is inserted into DOM */
  public connectedCallback(): void {
    this.triggerRender();
    this.onMount();
  }

  /** System call for when component is removed from DOM */
  public disconnectedCallback(): void {
    this.onUnmount();
  }

  // --------------------------------------- STATIC CALL ------------------------------------

  /** Element definition */
  public static __definition__?: Definition;

  /** Element attributes */
  public static get attributes(): { [key: string]: Attribute<unknown>; } {
    return this.__definition__?.attributes ?? {} as { [key: string]: Attribute<unknown>; };
  }

  /** Attributes to observe */
  public static get observedAttributes(): string[] {
    return Object.keys(this.attributes);
  }
}
