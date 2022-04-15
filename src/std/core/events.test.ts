import { assertEquals } from 'deno/testing/asserts.ts';

import { EventsHandler } from './events.ts';

Deno.test('Events', async (ctx) => {

  await ctx.step('Event handler shoud emit', async () => {
    const expected = 'Hello world!';

    const result = await new Promise(res => {
      const handler = new EventsHandler<{ test: string }>();

      handler.on('test', (data) => {
        res(data);
      });

      handler.emit('test', expected);
    });

    assertEquals(result, expected);
  });

});
