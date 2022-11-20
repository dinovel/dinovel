import { color, percent } from 'npm:csx';
import { ColorScheme, Rainbow12Bit } from './color-palette.ts';
import { Observable, Subject } from 'rxjs';

const defaultName = 'default';

export type ColorModAction = (colorCode: string, level?: number) => string;

export type ColorModifier = 'lighten' | 'darken' | 'opacity';

export interface IColorHandler {
  get(name: string, mode?: ColorModifier, level?: number): string;
  set(name: string, colorCode: string): void;

  setModifier(type: ColorModifier, mod: ColorModAction): void;
  getColorPalette<T extends string>(baseColor?: Partial<Record<T, string>>, override?: boolean): ColorPalette<T>;

  readonly rainbow12Bit: ColorPalette<Extract<keyof typeof Rainbow12Bit, string>>;
  readonly colorScheme: ColorPalette<Extract<keyof typeof ColorScheme, string>>;

  readonly updated$: Observable<void>;
}

export class ColorHandler implements IColorHandler {
  #extras: Map<string, string> = new Map();
  #paletteProxy?: ColorPaletteMod<string>;
  #rainbowInit = false;
  #colorSchemeInit = false;
  #onUpdate = new Subject<void>();

  get rainbow12Bit(): ColorPalette<Extract<keyof typeof Rainbow12Bit, string>> {
    if (this.#rainbowInit && this.#paletteProxy) {
      return this.#paletteProxy as ColorPalette<Extract<keyof typeof Rainbow12Bit, string>>;
    }

    this.#rainbowInit = true;
    return this.getColorPalette(Rainbow12Bit);
  }

  get colorScheme(): ColorPalette<Extract<keyof typeof ColorScheme, string>> {
    if (this.#colorSchemeInit && this.#paletteProxy) {
      return this.#paletteProxy as ColorPalette<Extract<keyof typeof ColorScheme, string>>;
    }

    this.#colorSchemeInit = true;
    return this.getColorPalette(ColorScheme);
  }

  get updated$() {
    return this.#onUpdate;
  }

  constructor() {
    this.#extras.set(defaultName, '#ffffff');
  }

  #lighten: ColorModAction = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .lighten(percent(level)).toString();
  };

  #darken: ColorModAction = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .darken(percent(level)).toString();
  };

  #opacity: ColorModAction = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .fade(percent(level)).toString();
  };

  get(name: string, mode?: ColorModifier, level = 10) {
    const color = this.#extras.get(name) ?? this.#extras.get(defaultName);
    if (!color) {
      throw new Error('Default color not set');
    }

    switch (mode) {
      case 'lighten':
        return this.#lighten(color, level);
      case 'darken':
        return this.#darken(color, level);
      case 'opacity':
        return this.#opacity(color, level);
      default:
        return color;
    }
  }

  set(name: string, colorCode: string) {
    const current = this.#extras.get(name);
    if (current === colorCode) return;

    this.#extras.set(name, colorCode);
    this.#onUpdate.next();
  }

  setModifier(type: ColorModifier, mod: ColorModAction) {
    switch (type) {
      case 'lighten':
        this.#lighten = mod;
        break;
      case 'darken':
        this.#darken = mod;
        break;
      case 'opacity':
        this.#opacity = mod;
        break;
    }
  }

  getColorPalette<T extends string>(baseColor?: Partial<Record<T, string>>, override = false): ColorPalette<T> {
    const keys = Object.keys(baseColor ?? {}) as T[];
    for (const key of keys) {
      if (!override && this.#extras.has(key)) continue;
      const colorValue = baseColor?.[key];
      if (!colorValue) continue;

      this.#extras.set(key, colorValue);
    }

    return this.#buildBaseProxy<T>();
  }

  #buildBaseProxy<T extends string>(): ColorPalette<T> {
    if (this.#paletteProxy) return this.#paletteProxy as ColorPalette<T>;

    const $mod = this.#buildModProxy();
    const proxy = new Proxy({} as ColorPalette<T>, {
      get: (_, name: T) => {
        if (name === '$mod') return $mod;
        return this.get(name as string);
      },
      set: (_, name: T, value: string) => {
        this.set(name as string, value);
        return true;
      },
    });
    this.#paletteProxy = proxy;
    return proxy;
  }

  #buildModProxy<T extends string>(): ColorPaletteMod<T> {
    return new Proxy({} as ColorPaletteMod<T>, {
      get: (_, name: T) => {
        const [colorName, mod, level] = getColorNameParts(name);
        return this.get(colorName, mod, level);
      },

      set: () => {
        throw new Error('Cannot set value on color modifier');
      },
    });
  }
}

export type ColorModifierLevel =
  | 0
  | 5
  | 10
  | 15
  | 20
  | 25
  | 30
  | 35
  | 40
  | 45
  | 50
  | 55
  | 60
  | 65
  | 70
  | 75
  | 80
  | 85
  | 90
  | 95
  | 100;

export type ColorPaletteKeys<T extends string = 'default'> = `${T}${Capitalize<ColorModifier>}${ColorModifierLevel}`;

export type ColorPaletteMod<T extends string> = {
  readonly [K in ColorPaletteKeys<T>]: string;
};

export type ColorPalette<T extends string = 'default'> =
  & { readonly $mod: ColorPaletteMod<T> }
  & { [K in T]: string };

function getColorNameParts(name: string): [string, ColorModifier | undefined, number] {
  const names: Capitalize<ColorModifier>[] = ['Lighten', 'Darken', 'Opacity'];
  for (const n of names) {
    const pos = name.lastIndexOf(n);
    if (pos === -1) continue;

    const baseName = name.slice(0, pos);
    const level = (parseInt(name.slice(pos + n.length), 10) || 10);
    return [baseName, n.toLowerCase() as ColorModifier, level];
  }

  return [name, undefined, 0];
}
