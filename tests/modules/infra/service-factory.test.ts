import { modInfra, t } from '../../dep.ts';

Deno.test('#ServiceFactory', async (steps) => {
  await steps.step('.buildFactory', async (buildSteps) => {
    await buildSteps.step('arguments are in order', () => {
      const dep1 = modInfra.createToken<string>('dep1');
      const dep2 = modInfra.createToken<number>('dep2');

      class Service {
        constructor(public dep1: string, public dep2: number) {}
      }

      const factory = modInfra.buildFactory(dep1, dep2, Service);

      t.assertEquals(factory[0], dep1);
      t.assertEquals(factory[1], dep2);
      t.assertEquals(factory[2], Service);
    });

    await buildSteps.step('extracts the token', () => {
      const dep1 = modInfra.createToken<string>('dep1');
      const dep2 = modInfra.createToken<number>('dep2');

      class Service {
        constructor(public dep1: string, public dep2: number) {}
      }

      const factory = modInfra.buildFactory({ token: dep1 }, { token: dep2 }, Service);

      t.assertEquals(factory[0], dep1);
      t.assertEquals(factory[1], dep2);
      t.assertEquals(factory[2], Service);
    });

    await buildSteps.step('extracts the token from circular', () => {
      class Service {
        constructor(public ss: Service) {}

        static token = modInfra.createToken<Service>('Service');
        static factory = modInfra.buildFactory(Service, Service);
      }

      t.assertEquals(Service.factory[0], Service.token);
    });
  });
});
