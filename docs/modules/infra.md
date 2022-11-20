# Infra

This module provides services for the internal infrastructure. It is not meant to be used by the end user, but by the
other modules.

## Container

It's the root object to handle dependency injection. A default container is created when the module is loaded. It can be
accessed using the `container` property of the module.

**Token:**

A token is a unique identifier for a dependency. It can be used to retrieve a dependency from the container. A singleton
can be created by setting the `singleton` property to `true`. The helper function `createToken` can be used to create a
token:

`createToken<T>(name: string, singleton: boolean): Token<T>`

**ServiceFactory:**

A service factory is an array with the dependencie's tokens and the service constructor. The helper function
`buildFactory` can be used to create a factory:

`buildFactory<T, D1, D2>(dep1: Token<D1>, dep2: Token<D2>, constructor: new (D1, D2) => T): ServiceFactory<T>`

### How to use

```ts
// my-service.ts
import { buildFactory, createToken } from '$dinovel/modules/infra/mod.ts';

export class MyService {
  constructor() {
    // ...
  }

  static token = createToken<MyService>('MyService');
  static factory = buildFactory(MyService);
}

// my-other-service.ts
import { buildFactory, createToken } from '$dinovel/modules/infra/mod.ts';
import { MyService } from './my-service.ts';

export class MyOtherService {
  constructor(
    private myService: MyService,
  ) {
    // ...
  }

  token = createToken<MyOtherService>('MyOtherService');
  factory = buildFactory(MyService, MyOtherService);
}

// my-module.ts
import { container } from '$dinovel/modules/infra/mod.ts';
import { MyService } from './my-service.ts';
import { MyOtherService } from './my-other-service.ts';

function init() {
  container.register(MyService);
  container.register(MyOtherService);
}

// my-app.ts
import { container } from '$dinovel/modules/infra/mod.ts';

function main() {
  // Service is created and injected into MyOtherService
  const myOtherService = container.get(MyOtherService);
}
```

---

## TypedMap\<T\>

Is type-safe map, used internally by services that need to track objects by a key.

### How to use

```ts
// providers.ts
import { TypedMap } from '$dinovel/modules/infra/mod.ts';

type Providers = {
  storage: Storage;
  database: Database;
};

export const providers = new TypedMap<Providers>({
  storage: new Storage(),
  database: new Database(),
});

// main.ts
import { providers } from './providers.ts';

const storage = providers.get('storage');
const database = providers.get('database');
```
