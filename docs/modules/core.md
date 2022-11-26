# Core

This module is used to initialize core systems. It's where the game loop is started and the systems initialized.

## Initialization

The core module is initialized by calling the `initDinovel` function. This function takes a `InitOptions` struct as an
argument. This struct contains the following fields:

- `rootDocument`: Where to render the game components. This is a `Document` object.
- `depsContainer`: The dependency container. This is a [Container](/modules/infra?id=container) object, if undefined, a
  new one will be created.
- `registerDefaults`: Whether to register the default systems. If `false`, you will have to register the systems you
  want to use manually. Defaults to `true`.

### Example

```ts
import { initDinovel } from '$dinovel/modules/core/mod.ts';

const dinovel = initDinovel({
  rootDocument: document,
});

const rootLogger = dinovel.logger.create('MyGame');

rootLogger.debug('Loading objects...');
await loadObjects(dinovel);
rootLogger.debug('Loading objects... done!');

try {
  rootLogger.debug('Starting game');
  await dinovel.start();
  rootLogger.debug('Exiting game');
} catch (e) {
  dinovel.logger.error('Error while running game', e);
}
```
