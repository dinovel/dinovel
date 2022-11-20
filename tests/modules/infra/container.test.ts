import { modInfra, t } from '../../dep.ts';

class Service1 {
  public name = 'Service1';

  static token = modInfra.createToken<Service1>('Service1', true);
  static factory = modInfra.buildFactory(Service1);
}

class Service2 {
  public name = 'Service2';

  constructor(public service1: Service1) {}

  static token = modInfra.createToken<Service2>('Service2');
  static factory = modInfra.buildFactory(Service1, Service2);
}

Deno.test('#container', async (steps) => {
  await steps.step('.register', async (regSteps) => {
    await regSteps.step('register a service', () => {
      const container = new modInfra.Container();
      container.register(Service1);
      const instance = container.get(Service1.token);
      t.assertInstanceOf(instance, Service1);
    });

    await regSteps.step('register a service with dependencies', () => {
      const container = new modInfra.Container();
      container.register(Service2);
      container.register(Service1);

      const instance = container.get(Service2.token);

      t.assertInstanceOf(instance, Service2);
    });

    await regSteps.step('when service has recursive deps, throws', () => {
      const container = new modInfra.Container();

      class Service3 {
        constructor(public service3: Service3) {}
        static token = modInfra.createToken<Service3>('Service3');
        static factory = modInfra.buildFactory(Service3, Service3);
      }

      t.assertThrows(
        () => {
          container.register(Service3);
        },
        Error,
        'Token Service3 is infinitely recursive',
      );
    });

    await regSteps.step('when service is a singleton', async (singlSteps) => {
      await singlSteps.step('and is not instantiated, override', () => {
        const container = new modInfra.Container();

        class P {}

        container.register(Service1);
        container.register({ token: Service1.token, factory: [P] });

        const instance = container.get(Service1.token);

        t.assertInstanceOf(instance, P);
      });

      await singlSteps.step('and is instantiated, throw', () => {
        const container = new modInfra.Container();

        container.register(Service1);
        container.get(Service1.token);

        t.assertThrows(
          () => {
            container.register(Service1);
          },
          Error,
          'Token Service1 is a singleton and is already instantiated',
        );
      });
    });

    await regSteps.step('when service is not a singleton', async (singlSteps) => {
      await singlSteps.step('and is not instantiated, override', () => {
        const container = new modInfra.Container();

        class P {}

        container.register(Service1);
        container.register(Service2);
        container.register({ token: Service2.token, factory: [P] });

        const instance = container.get(Service2.token);

        t.assertInstanceOf(instance, P);
      });

      await singlSteps.step('and is instantiated, override', () => {
        const container = new modInfra.Container();

        class P {}

        container.register(Service1);
        container.register(Service2);
        container.get(Service2.token);
        container.register({ token: Service2.token, factory: [P] });

        const instance = container.get(Service2.token);

        t.assertInstanceOf(instance, P);
      });
    });
  });

  await steps.step('.registerValue', async (regSteps) => {
    await regSteps.step('register a value', () => {
      const container = new modInfra.Container();
      const token = modInfra.createToken<string>('token');

      container.registerValue(token, 'value');

      const value = container.get(token);
      t.assert(value === 'value');
    });

    await regSteps.step('when value is a singleton', async (singlSteps) => {
      await singlSteps.step('register value', () => {
        const container = new modInfra.Container();
        const token = modInfra.createToken<string>('token', true);

        container.registerValue(token, 'value');

        const value = container.get(token);
        t.assert(value === 'value');
      });

      await singlSteps.step('and is defined, throw', () => {
        const container = new modInfra.Container();
        const token = modInfra.createToken<string>('token', true);

        container.registerValue(token, 'value');

        t.assertThrows(
          () => {
            container.registerValue(token, 'value2');
          },
          Error,
          'Token token is a singleton and is already instantiated',
        );
      });
    });

    await regSteps.step('when value is not a singleton', async (singlSteps) => {
      await singlSteps.step('register value', () => {
        const container = new modInfra.Container();
        const token = modInfra.createToken<string>('token');

        container.registerValue(token, 'value');

        const value = container.get(token);
        t.assert(value === 'value');
      });

      await singlSteps.step('and is defined, override', () => {
        const container = new modInfra.Container();
        const token = modInfra.createToken<string>('token');

        container.registerValue(token, 'value');
        container.registerValue(token, 'value2');

        const value = container.get(token);
        t.assert(value === 'value2');
      });
    });
  });

  await steps.step('.get', async (getSteps) => {
    await getSteps.step('get service', () => {
      const container = new modInfra.Container();
      container.register(Service1);

      const instance = container.get(Service1.token);

      t.assertInstanceOf(instance, Service1);
    });

    await getSteps.step('get service with dependencies', () => {
      const container = new modInfra.Container();
      container.register(Service2);
      container.register(Service1);

      const instance = container.get(Service2.token);

      t.assertInstanceOf(instance, Service2);
    });

    await getSteps.step('when is not registered, throws', () => {
      const container = new modInfra.Container();

      t.assertThrows(
        () => {
          container.get(Service1.token);
        },
        Error,
        'Token Service1 is not registered',
      );
    });

    await getSteps.step('when dependency is not defined, throws', () => {
      const container = new modInfra.Container();
      container.register(Service2);

      t.assertThrows(
        () => {
          container.get(Service2.token);
        },
        Error,
        'Token Service2 has a dependency on Service1 which is not registered: Token Service1 is not registered',
      );
    });

    await getSteps.step('when is a singleton, return same value', () => {
      const container = new modInfra.Container();
      container.register(Service1);

      const instance1 = container.get(Service1.token);
      const instance2 = container.get(Service1.token);

      t.assert(instance1 === instance2);
    });

    await getSteps.step('when is not a singleton, return different values', () => {
      const container = new modInfra.Container();
      container.register(Service1);
      container.register(Service2);

      const instance1 = container.get(Service2.token);
      const instance2 = container.get(Service2.token);

      t.assertFalse(instance1 === instance2);
    });
  });
});
