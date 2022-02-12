import { assertEquals } from 'deno/testing/asserts.ts';

import { Subject } from './subject.ts';

Deno.test('Should emit value', async () => {
  const expected = 'Hello world!';

  const subject = new Subject<string>();
  const result = new Promise(next => {
    subject.subscribe({next});
  });
  subject.next(expected);

  assertEquals(await result, expected);
});

Deno.test('Should emit error', async () => {
  const expected = new Error('Hello world!');

  const subject = new Subject<string>();
  const result = new Promise(next => {
    subject.subscribe({error: next});
  });
  subject.error(expected);

  assertEquals(await result, expected);
});

Deno.test('Should not emit after completed', async () => {
  const subject = new Subject<string>();

  const result = new Promise<void>(res => {
    subject.subscribe({complete: res});
  });
  subject.complete();

  assertEquals(await result, undefined);

  let called = false;
  await new Promise<void>(res => {
    subject.subscribe({next: () => {
      called = true;
      res();
    }});

    setTimeout(() => res(), 300);
  });

  assertEquals(called, false);
});
