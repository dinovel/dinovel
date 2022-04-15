import { assertEquals, assertThrows } from 'deno/testing/asserts.ts';
import { compareSemVersion, parseSemVersion } from './sem-version.ts';

Deno.test('SemVersion', async (ctx) => {
  await ctx.step('Parsing should match expected', () => {
    const expected = {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'pre-version',
      build: 'meta',
      version: '1.2.3-pre-version+meta',
    };

    const actual = parseSemVersion('1.2.3-pre-version+meta');

    assertEquals(actual.major, expected.major);
    assertEquals(actual.minor, expected.minor);
    assertEquals(actual.patch, expected.patch);
    assertEquals(actual.prerelease, expected.prerelease);
    assertEquals(actual.build, expected.build);
    assertEquals(actual.version, expected.version);
  });

  await ctx.step('Parsing should ignore space', () => {
    const expected = {
      major: 1,
      minor: 18,
      patch: 2,
      prerelease: '',
      build: '',
      version: 'deno 1.18.2 (release, x86_64-pc-windows-msvc)',
    };

    const actual = parseSemVersion(expected.version);

    assertEquals(actual.major, expected.major);
    assertEquals(actual.minor, expected.minor);
    assertEquals(actual.patch, expected.patch);
    assertEquals(actual.prerelease, expected.prerelease);
    assertEquals(actual.build, expected.build);
    assertEquals(actual.version, expected.version);
  });

  await ctx.step('Parsing should throw error on invalid', () => {
    assertThrows(() => {
      parseSemVersion('potatos');
    });
  });

  await ctx.step('Comparison should return expectd', () => {
    assertEquals(compareSemVersion('1.2.3-pre-batas-version+meta', '1.2.3-pre-version+meta-trio'), 0);
    assertEquals(compareSemVersion('2.2.3', '1.2.3'), 1);
    assertEquals(compareSemVersion('1.3.3', '1.2.3'), 1);
    assertEquals(compareSemVersion('1.2.4', '1.2.3'), 1);
    assertEquals(compareSemVersion('1.2.3', '1.2.3'), 0);
    assertEquals(compareSemVersion('1.2.3', '1.2.3-pre-version+meta'), 0);
    assertEquals(compareSemVersion('0.2.3', '1.2.3'), -1);
    assertEquals(compareSemVersion('1.1.3', '1.2.3'), -1);
    assertEquals(compareSemVersion('1.2.2', '1.2.3'), -1);
  });
});
