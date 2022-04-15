import { assertEquals, assertThrows } from 'deno/testing/asserts.ts';
import { valueMapStore } from './value-map-store.ts';

Deno.test('ValueMapStore', async ctx => {
  await ctx.step('Should serialize by name', () => {
    const subject1 = 258;
    const subject2 = -125;

    const expected1 = '258';
    const expected2 = '-125';

    const actual1 = valueMapStore.serialize('number', subject1);
    const actual2 = valueMapStore.serialize('number', subject2);

    assertEquals(actual1, expected1);
    assertEquals(actual2, expected2);
  });

  await ctx.step('Should parse by name', () => {
    const subject1 = '258';
    const subject2 = '-125';

    const expected1 = 258;
    const expected2 = -125;

    const actual1 = valueMapStore.parse('number', subject1);
    const actual2 = valueMapStore.parse('number', subject2);

    assertEquals(actual1, expected1);
    assertEquals(actual2, expected2);
  });

  await ctx.step('Should throw when serializing unknown value', () => {
    const subject = 'unknown';

    // deno-lint-ignore no-explicit-any
    assertThrows(() => valueMapStore.serialize('unknown' as any, subject));
  });
});
