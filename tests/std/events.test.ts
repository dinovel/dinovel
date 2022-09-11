import { EventsHandler } from 'dinovel/std/events.ts';
import { assertEquals, assertThrows } from "deno/testing/asserts.ts";
import { L } from '../_utils/observables.ts';

type TestEvents = {
  action1: never,
  action2: string,
  action3: [number, string],
}

Deno.test('#std/events', async t => {

  await t.step('Event is emited', async () => {
    const handler = new EventsHandler<TestEvents>();

    const listner = L(handler.on('action1'));

    handler.emit('action1');

    await listner.promise;

    assertEquals(listner.calls, 1);
  });

  await t.step('Event is emited with data', async () => {
    const handler = new EventsHandler<TestEvents>();

    const listner = L(handler.on('action2'));

    handler.emit('action2', 'data');

    await listner.promise;

    assertEquals(listner.data[0], 'data');
  });

  await t.step('Event is emited with multiple data', async () => {
    const handler = new EventsHandler<TestEvents>();

    const listner = L(handler.on('action3'));

    handler.emit('action3', [1, 'data']);

    await listner.promise;

    assertEquals(listner.data[0], [1, 'data']);
  });

  await t.step('Block "*" events', () => {
    const handler = new EventsHandler<TestEvents>();
    // deno-lint-ignore no-explicit-any
    assertThrows(() => handler.emit('*' as any));
  });

  await t.step('Event is emited to all listners', async () => {
    const handler = new EventsHandler<TestEvents>();

    const listner1 = L(handler.on('action1'));
    const listner2 = L(handler.on('action1'));

    handler.emit('action1');

    await listner1.promise;
    await listner2.promise;

    assertEquals(listner1.calls, 1);
    assertEquals(listner2.calls, 1);
  });

  await t.step('Event is emited to all listners with data', async () => {
    const handler = new EventsHandler<TestEvents>();

    const listner1 = L(handler.on('action2'));
    const listner2 = L(handler.on('action2'));

    handler.emit('action2', 'data');

    await listner1.promise;
    await listner2.promise;

    assertEquals(listner1.data[0], 'data');
    assertEquals(listner2.data[0], 'data');
  });

});
