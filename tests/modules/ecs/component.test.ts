import { modEcs, t } from '../../dep.ts';

Deno.test('#component', async (steps) => {
  await steps.step('.createComponent', async (createSteps) => {
    await createSteps.step('creates a component factory', () => {
      interface MyComp {
        foo: string;
        bar: number;
      }

      const myComp = modEcs.createComponent<MyComp>('myComp', { foo: 'foo', bar: 0 });

      const entity = myComp.apply({ id: 0 }, { foo: 'barz', bar: 1 });

      t.assertEquals(entity, {
        id: 0,
        [myComp.type]: {
          foo: 'barz',
          bar: 1,
        },
      });
    });

    await createSteps.step('when no state is defined, set initial state', () => {
      interface MyComp {
        foo: string;
        bar: number;
      }

      const myComp = modEcs.createComponent<MyComp>('myComp', { foo: 'foo', bar: 0 });

      const entity = myComp.apply({ id: 0 });

      t.assertEquals(entity, {
        id: 0,
        [myComp.type]: {
          foo: 'foo',
          bar: 0,
        },
      });
    });
  });

  await steps.step('.isComponent', async (isSteps) => {
    await isSteps.step('returns true when entity has component', () => {
      interface MyComp {
        foo: string;
        bar: number;
      }

      const myComp = modEcs.createComponent<MyComp>('myComp', { foo: 'foo', bar: 0 });

      const entity = myComp.apply({ id: 0 });

      t.assert(modEcs.isComponent(entity, myComp.type));
    });

    await isSteps.step('returns false when entity does not have component', () => {
      interface MyComp {
        foo: string;
        bar: number;
      }

      const myComp = modEcs.createComponent<MyComp>('myComp', { foo: 'foo', bar: 0 });

      const entity = { id: 0 };

      t.assertFalse(modEcs.isComponent(entity, myComp.type));
    });
  });
});
