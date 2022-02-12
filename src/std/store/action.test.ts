import { assertEquals } from 'deno/testing/asserts.ts';

import { createAction } from './action.ts';

Deno.test('Should create action for type', () => {
  const type = Symbol('type');
  const action = createAction(type);

  assertEquals(action().type, type);
});

Deno.test('Should match payload', () => {
  const type = Symbol('type');

  interface Payload {
    foo: string;
    data: number;
  }

  const expected: Payload = {
    foo: 'bar',
    data: 123,
  };

  const action = createAction<Payload>(type)(expected);

  assertEquals(action.payload.data, expected.data);
  assertEquals(action.payload.foo, expected.foo);
});
