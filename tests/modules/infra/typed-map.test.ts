import { modInfra, t } from '../../dep.ts';

type Test = {
  name: string;
  age: number;
};

Deno.test('#TypedMap', async (steps) => {
  await steps.step('.get', async (getSteps) => {
    await getSteps.step('return value for key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'John' });
      const name = map.get('name');
      t.assertEquals(name, 'John');
    });

    await getSteps.step('return undefined for non-existent key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'John' });
      const age = map.get('age');
      t.assertEquals(age, undefined);
    });
  });

  await steps.step('.set', async (setSteps) => {
    await setSteps.step('set value for key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'potato' });
      map.set('name', 'John');
      t.assertEquals(map.get('name'), 'John');
    });

    await setSteps.step('set value for non-existent key', () => {
      const map = modInfra.TypedMap.create<Test>();
      map.set('age', 18);
      t.assertEquals(map.get('age'), 18);
    });
  });

  await steps.step('.delete', async (deleteSteps) => {
    await deleteSteps.step('delete value for key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'John' });
      map.delete('name');
      t.assertEquals(map.get('name'), undefined);
    });

    await deleteSteps.step('delete value for non-existent key', () => {
      const map = modInfra.TypedMap.create<Test>();
      map.delete('age');
      t.assertEquals(map.get('age'), undefined);
    });
  });

  await steps.step('.has', async (hasSteps) => {
    await hasSteps.step('return true for key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'John' });
      t.assertEquals(map.has('name'), true);
    });

    await hasSteps.step('return false for non-existent key', () => {
      const map = modInfra.TypedMap.create<Test>({ name: 'John' });
      t.assertEquals(map.has('age'), false);
    });
  });
});
