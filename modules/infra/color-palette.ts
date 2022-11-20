import { color, percent } from 'npm:csx';
import { container } from './container.ts';
import { createToken } from './token.ts';

const defaultName = 'default';

export type ColorMod = (colorCode: string, level?: number) => string;

export type AppColorKeys<T extends string> =
  | `${T}Darken`
  | `${T}Darken2`
  | `${T}Darken3`
  | `${T}Darken4`
  | `${T}Darken5`
  | `${T}Lighten`
  | `${T}Lighten2`
  | `${T}Lighten3`
  | `${T}Lighten4`
  | `${T}Lighten5`
  | `${T}Opacity`
  | `${T}Opacity2`
  | `${T}Opacity3`
  | `${T}Opacity4`
  | `${T}Opacity5`
  | `${T}Opacity6`
  | `${T}Opacity7`
  | `${T}Opacity8`
  | `${T}Opacity9`;

export type RootColorPalette<T extends string> =
  & {
    readonly [K in AppColorKeys<T>]: string;
  }
  & { [K in T]: string };

export type AppColorPalette<T extends string = 'default'> =
  & RootColorPalette<T>
  & RootColorPalette<'primary'>
  & RootColorPalette<'accent'>
  & RootColorPalette<'background'>
  & RootColorPalette<'foreground'>
  & RootColorPalette<'warn'>
  & RootColorPalette<'danger'>
  & RootColorPalette<'success'>;

export class ColorPalette {
  #extras: Map<string, string> = new Map();

  constructor(defaultColor: string = '#ffffff') {
    this.#extras.set(defaultName, defaultColor);
  }

  #lighten: ColorMod = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .lighten(percent(level)).toString();
  };

  #darken: ColorMod = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .darken(percent(level)).toString();
  };

  #opacity: ColorMod = (colorCode, level = 10) => {
    if (level === 0) return colorCode;
    return color(colorCode)
      .fade(percent(level)).toString();
  };

  get(name: string, mode?: 'lighten' | 'darken' | 'opacity', level = 10) {
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
    this.#extras.set(name, colorCode);
  }

  setModifier(type: 'lighten' | 'darken' | 'opacity', mod: ColorMod) {
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
}

export const ColorPaletteService = createToken<ColorPalette>('ColorPaletteService', true);

container.register({
  token: ColorPaletteService,
  factory: [ColorPalette],
});

export function getColorPalette<T extends string>(initialValues: { [K in T]: string }): AppColorPalette<T>;
export function getColorPalette<T1 extends string, T2 extends string>(
  initialValues: { [K in T1 & T2]: string },
): AppColorPalette<T1> & AppColorPalette<T2>;
export function getColorPalette<T1 extends string, T2 extends string, T3 extends string>(
  initialValues: { [K in T1 & T2 & T3]: string },
): AppColorPalette<T1> & AppColorPalette<T2> & AppColorPalette<T3>;
export function getColorPalette<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(
  initialValues: { [K in T1 & T2 & T3 & T4]: string },
): AppColorPalette<T1> & AppColorPalette<T2> & AppColorPalette<T3> & AppColorPalette<T4>;
export function getColorPalette<
  T1 extends string,
  T2 extends string,
  T3 extends string,
  T4 extends string,
  T5 extends string,
>(
  initialValues: { [K in T1 & T2 & T3 & T4 & T5]: string },
): AppColorPalette<T1> & AppColorPalette<T2> & AppColorPalette<T3> & AppColorPalette<T4> & AppColorPalette<T5>;
export function getColorPalette<
  T1 extends string,
  T2 extends string,
  T3 extends string,
  T4 extends string,
  T5 extends string,
  T6 extends string,
>(
  initialValues: { [K in T1 & T2 & T3 & T4 & T5 & T6]: string },
):
  & AppColorPalette<T1>
  & AppColorPalette<T2>
  & AppColorPalette<T3>
  & AppColorPalette<T4>
  & AppColorPalette<T5>
  & AppColorPalette<T6>;
export function getColorPalette<
  T1 extends string,
  T2 extends string,
  T3 extends string,
  T4 extends string,
  T5 extends string,
  T6 extends string,
  T7 extends string,
>(
  initialValues: { [K in T1 & T2 & T3 & T4 & T5 & T6 & T7]: string },
):
  & AppColorPalette<T1>
  & AppColorPalette<T2>
  & AppColorPalette<T3>
  & AppColorPalette<T4>
  & AppColorPalette<T5>
  & AppColorPalette<T6>
  & AppColorPalette<T7>;
export function getColorPalette<
  T1 extends string,
  T2 extends string,
  T3 extends string,
  T4 extends string,
  T5 extends string,
  T6 extends string,
  T7 extends string,
  T8 extends string,
>(
  initialValues: { [K in T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8]: string },
):
  & AppColorPalette<T1>
  & AppColorPalette<T2>
  & AppColorPalette<T3>
  & AppColorPalette<T4>
  & AppColorPalette<T5>
  & AppColorPalette<T6>
  & AppColorPalette<T7>
  & AppColorPalette<T8>;
export function getColorPalette(): AppColorPalette;
export function getColorPalette<T extends string>(initialValues: Record<string, string> = {}): AppColorPalette<T> {
  const colorPalette = container.get<ColorPalette>(ColorPaletteService);

  Object.entries(initialValues).forEach(([name, color]) => {
    colorPalette.set(name, color);
  });

  return new Proxy({} as unknown as AppColorPalette<T>, {
    get: (_, prop: string) => {
      const [name, mode, level] = getColorNameParts(prop);
      return colorPalette.get(name, mode, level);
    },

    set: (_, prop: string, value: string) => {
      const [name] = getColorNameParts(prop);
      colorPalette.set(name, value);
      return true;
    },
  });
}

export function getColorNameParts(name: string): [string, 'lighten' | 'darken' | 'opacity' | undefined, number] {
  const names = ['Lighten', 'Darken', 'Opacity'];
  for (const n of names) {
    const pos = name.lastIndexOf(n);
    if (pos === -1) continue;

    const baseName = name.slice(0, pos);
    const level = (parseInt(name.slice(pos + n.length), 10) || 1) * 10;
    return [baseName, n.toLowerCase() as 'lighten' | 'darken' | 'opacity', level];
  }

  return [name, undefined, 0];
}

// Should this be a separate package?
// Can it have a factory function?
// TODO: Write docs for this
