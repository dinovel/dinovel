import { assertEquals } from "deno/testing/asserts.ts";
import { getRelativeUrl } from '../../infra/utils.ts';

Deno.test('getRelativeUrl', () => {
  const sourceUrl = new URL('file:///home/user/src/file.ts');
  const rootDir = 'file:///home/user/src';

  const relativeUrl = getRelativeUrl(sourceUrl, rootDir);

  assertEquals(relativeUrl, './file.ts');
});
