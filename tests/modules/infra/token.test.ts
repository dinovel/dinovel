import { modInfra, t } from '../../dep.ts';

Deno.test('#token', async (step) => {
  await step.step('.createToken', async (createTokenStep) => {
    await createTokenStep.step('create a unique token', () => {
      const token1 = modInfra.createToken();
      const token2 = modInfra.createToken();

      t.assertNotEquals(token1, token2);
    });

    await createTokenStep.step('create a singleton token', () => {
      const token1 = modInfra.createToken('foo', true);
      const token2 = modInfra.createToken('foo', true);

      t.assertEquals(token1, token2);
    });

    await createTokenStep.step('create a unique token with description', () => {
      const token1 = modInfra.createToken('foo');
      const token2 = modInfra.createToken('foo');

      t.assertNotEquals(token1, token2);
    });
  });

  await step.step('.isSingleton', async (isTokenStep) => {
    await isTokenStep.step('when is singleton, return true', () => {
      const token = modInfra.createToken('foo', true);

      t.assert(modInfra.isSingleton(token));
    });

    await isTokenStep.step('when is not singleton, return false', () => {
      const token = modInfra.createToken('foo');

      t.assertFalse(modInfra.isSingleton(token));
    });
  });
});
