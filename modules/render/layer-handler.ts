import { types, typestyle } from './typestyle.deps.ts';

export interface LayperProps {
  id: string;
  style: types.NestedCSSProperties;
  classNames: string[];
  template?: string;
}

export interface ILayerHandler {
  has: (name: string) => boolean;
  declare: (name: string, props?: Partial<LayperProps>) => void;
  show: (name: string) => HTMLDivElement;
  hide: (name: string) => void;
  get: (name: string) => HTMLDivElement | undefined;
}

export class LayerHandler implements ILayerHandler {
  #layers = new Map<string, LayperProps>();
  #document: Document;

  constructor(viewDocument: Document) {
    this.#document = viewDocument;
  }

  has(name: string) {
    return this.#layers.has(name);
  }

  declare(name: string, props?: Partial<LayperProps> | undefined): void {
    const layerProps: LayperProps = {
      ...(props ?? {}),
      id: props?.id ?? this.#getId(name),
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        ...(props?.style ?? {}),
      },
      classNames: ['dn-layer', ...(props?.classNames ?? [])],
    };

    this.#layers.set(name, layerProps);
    this.#document.getElementById(layerProps.id)?.remove();
  }

  hide(name: string) {
    const layer = this.#layers.get(name);
    if (layer) {
      this.#document.getElementById(layer.id)?.remove();
    }
  }

  show(name: string) {
    const layer = this.#layers.get(name);
    if (!layer) throw new Error(`Layer "${name}" is not declared`);

    const element = this.#document.getElementById(layer.id);
    if (element) return element as HTMLDivElement;

    const div = this.#document.createElement('div');
    div.id = layer.id;

    if (layer.template) {
      div.innerHTML = layer.template;
    }

    const styleClass = typestyle.style(layer.style);
    div.classList.add(styleClass, ...layer.classNames);
    this.#document.body.appendChild(div);
    return div;
  }

  get(name: string) {
    const layer = this.#layers.get(name);
    if (!layer) return undefined;

    return this.#document.getElementById(layer.id) as HTMLDivElement ?? undefined;
  }

  #getId(name: string) {
    return `dn-layer-${name.toLowerCase()}`;
  }
}
