# Render

This module contains utilities to render content to the screen. It can be used to render text, images, and other content
to the screen, and is also where CSS can be defined.

## IStyleBuilder

The `StyleBuilder` class is used to define `html` and `body` CSS styles. Styles are defined by using the `importStyle`.
Multiple calls to `importStyle` will be combined into a single style definition. Everytime a new style is imported, the
css is updated.

### .importStyle

Used to define style properties. Can receive a plain object or an `IStylePlugin`. Values are only merged before render
is called.

_Plain object exaple_

```ts
import { StyleBuilderService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(StyleBuilderService)
  .importStyle({
    backgroundColor: 'black',
    color: 'white',
  });
```

_IStylePlugin example_

```ts
import { StyleBuilderService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

const fallbackFontPlugin = {
  active: true, // If false, the plugin will not be used. If undefined, it will be used.
  apply: (current) => {
    if (!current.fontFamily) {
      return {
        ...current,
        fontFamily: 'monospace',
      };
    }

    return current;
  },
};

container.get(StyleBuilderService)
  .importStyle(fallbackFontPlugin);
```

### .normalize

If invoked, it injects a style to normalize css between browsers. It's deactivated by default and can be called with
`true` or `false` to activate or deactivate it. Calling it after firt render will have no effect.

```ts
import { StyleBuilderService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(StyleBuilderService)
  .normalize(); // same as .normalize(true)
```

### .render

Renders the style to the screen. After first call it's called automatically when a new style is imported.

```ts
import { StyleBuilderService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(StyleBuilderService)
  .render();
```

### How to use

```ts
import { StyleBuilderService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(StyleBuilderService)
  .importStyle({
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  })
  .render();
```

its output will be:

```css
html, body {
  background-color: black;
  color: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
```

## IColorHandler

The `ColorHandler` class is used to define and apply colors that can be used in styles.

### Reading/Setting colors

```ts
import { ColorHandlerService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(ColorHandlerService)
  .set('primary', 'red')
  .set('secondary', 'blue')
  .set('tertiary', 'green');

// Reading colors
primaryColor = container.get(ColorHandlerService).get('primary');
```

### Modifiers

Colors can be modified using modifiers. There are 3 modifiers available: `lighten`, `darken`, and `opacity`.

```ts
import { ColorHandlerService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

const darkPrimary = container.get(ColorHandlerService)
  .get('primary', 'darken', 50); // 50% darker

const lightPrimary = container.get(ColorHandlerService)
  .get('primary', 'lighten', 50); // 50% lighter
```

Modinifiers functions can be replaced by custom functions. The function must receive a color and a percentage and return
a color string.

```ts
import { ColorHandlerService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

const customModifier = (color: string, percentage: number) => {
  // Do something with the color and percentage
  return color;
};

container.get(ColorHandlerService)
  .setModifier('darken', customModifier);
```

## Color Palettes

Color palettes can be used to define a set of colors that can be used in the application. By default 2 palettes are
available: `colorScheme` and `rainbow12Bit`. The can be always replaced by custom colors.

```ts
import { ColorHandlerService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

container.get(ColorHandlerService).colorScheme.primary = '#ff0000';
```

### Custom color palettes

Custom color palettes can be defined by using the `getColorPalette` method. The method receives an object with the
palette name and the colors.

```ts
import { ColorHandlerService } from '$dinovel/modules/render/mod.ts';
import { container } from '$dinovel/modules/infra/mod.ts';

const customPalette = container.get(ColorHandlerService)
  .getColorPalette({
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
  });

const color1 = customPalette.color1;
const darkColor1 = customPalette.$mod.color1Darken25; // 25% darker
```
