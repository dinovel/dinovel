# ECS

ECS, or Entity Component System, provide a way to organize your game objects. ECS is a design pattern that is used in
many game engines, and is a good way to organize your game objects. This will allow to decouple your game objects from
their logic, and make it easier to reuse them. ECS is also a good way to organize your game objects in a way that is
easy to serialize and deserialize.

## Entity

An entity is an object with a unique identifier. It is the base of ECS. Using the [ECS](#ECS) a new entity can be
created with a unique identifier.

### Create an entity

```ts
import { ECS } from '$dinovel/modules/ecs/mod.ts';

const ecs = new ECS();
const entity = ecs.createEntity();
```

## Component

A component is a data structure that contains data. It is used to store data about an entity. A component can be added
to an entity, and removed from an entity. A component can be added to multiple entities. In Dinovel, this is done using
a [ComponentFactory](#assign-a-component-to-an-entity).

### Create a component

A component can be created using the function `createComponent`, which takes a name and a data structure as parameters.
The data structure is the data that will be stored in the component by default.

```ts
import { createComponent } from '$dinovel/modules/ecs/mod.ts';

interface Position {
  x: number;
  y: number;
}

const PositionComponent = createComponent<Position>('position', {
  x: 0,
  y: 0,
});
```

### Assign a component to an entity

A component can be assigned to an entity using the function `apply` from the component. This function takes an entity
and a initial data structure as parameters. The initial data structure will be merged with the default data structure.

```ts
const entity = ecs.createEntity();

PositionComponent.apply(entity, {
  x: 10,
  y: 20,
});
```

## System

A system is a function that is called every frame. It is used to update the state of the game. In Dinovel, this is done
using an object that implements `update` and `draw` functions. They are called every frame, but the `draw` function is
only called after all `update` functions have been called.

A system also has a `requires` property, which is an array of components that the system requires. When `update` or
`draw` are called, the system will only be called if all the components in `requires` are present on the entity.

### Create a system

A system can be created using the function `createSystem`, which takes a list of components and callbacks as parameters.

```ts
import { createSystem } from '$dinovel/modules/ecs/mod.ts';

const PositionSystem = createSystem(
  [PositionComponent],
  (entity, position) => {
    position.x += 1;
    position.y += 1;
  },
  (entity, position) => {
    console.log(position);
  },
);

ecs.addSystem(PositionSystem);
```
