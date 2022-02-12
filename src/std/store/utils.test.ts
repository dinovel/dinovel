import { assertEquals } from 'deno/testing/asserts.ts';

import { deepClone } from './utils.ts';

Deno.test('DeepClone should copy inner objects', () => {
  const target = { a: 1, b: { c: 2 } };
  const target2 = target;
  const subject = deepClone(target);

  assertEquals(target === subject, false, 'target and subject should not be the same');
  assertEquals(target.b === subject.b, false, 'target.b and subject.b should not be the same');

  assertEquals(target2 === target, true, 'target should not change');
});
