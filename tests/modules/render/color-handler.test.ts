import { m, modRender, t } from '../../dep.ts';

Deno.test('#ColorHandler', async (steps) => {
  await steps.step('.get', async (getSteps) => {
    await getSteps.step('return color value by name', () => {
      const colorHandler = new modRender.ColorHandler();
      colorHandler.set('primary', 'red');

      t.assertEquals(colorHandler.get('primary'), 'red');
    });

    await getSteps.step('fallback to default', () => {
      const colorHandler = new modRender.ColorHandler();
      colorHandler.set('default', 'red');
      t.assertEquals(colorHandler.get('primary'), 'red');
    });

    await getSteps.step('return modifier value', () => {
      const colorHandler = new modRender.ColorHandler();
      colorHandler.set('primary', 'red');
      colorHandler.setModifier('lighten', (color, level) => `${color} ${level}`);
      t.assertEquals(colorHandler.get('primary', 'lighten', 10), 'red 10');
    });

    await getSteps.step('lighten modifier is called', () => {
      const colorHandler = new modRender.ColorHandler();

      const mod = m.spy(() => '');
      colorHandler.setModifier('lighten', mod);

      colorHandler.set('primary', 'red');
      colorHandler.get('primary', 'lighten', 20);

      m.assertSpyCall(mod, 0, { args: ['red', 20] });
    });

    await getSteps.step('darken modifier is called', () => {
      const colorHandler = new modRender.ColorHandler();

      const mod = m.spy(() => '');
      colorHandler.setModifier('darken', mod);

      colorHandler.set('primary', 'red');
      colorHandler.get('primary', 'darken', 20);

      m.assertSpyCall(mod, 0, { args: ['red', 20] });
    });

    await getSteps.step('opacity modifier is called', () => {
      const colorHandler = new modRender.ColorHandler();

      const mod = m.spy(() => '');
      colorHandler.setModifier('opacity', mod);

      colorHandler.set('primary', 'red');
      colorHandler.get('primary', 'opacity', 20);

      m.assertSpyCall(mod, 0, { args: ['red', 20] });
    });
  });

  await steps.step('.getColorPalette', async (paletteSteps) => {
    await paletteSteps.step('return color palette', () => {
      const colorHandler = new modRender.ColorHandler();

      const palette = colorHandler.getColorPalette({
        color1: 'red',
        color2: 'blue',
        color3: 'green',
      });

      t.assertEquals(palette.color1, 'red');
      t.assertEquals(palette.color2, 'blue');
      t.assertEquals(palette.color3, 'green');
    });

    await paletteSteps.step('modifier invokes action', () => {
      const colorHandler = new modRender.ColorHandler();

      const palette = colorHandler.getColorPalette({
        color1: 'red',
        color2: 'blue',
        color3: 'green',
      });

      const mod = m.spy(() => '');
      colorHandler.setModifier('darken', mod);

      palette.$mod.color1Darken15;

      m.assertSpyCall(mod, 0, { args: ['red', 15] });
    });
  });
});
