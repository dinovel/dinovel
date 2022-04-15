import {
  assertEquals,
  assertThrows,
} from 'deno/testing/asserts.ts';

import { createAction } from './action.ts';
import {
  createReducer,
  on,
} from './reducer.ts';

type AppState = {
  name: string;
  age: number;
  car: {
    brand: string;
    model: string;
  }
}

const changeName = createAction<string>('CHANGE_NAME');
const changeAge = createAction<number>('CHANGE_AGE');
const changeCarBrand = createAction<string>('CHANGE_CAR_BRAND');
const changeCarModel = createAction<string>('CHANGE_CAR_MODEL');

const getReducer = () => createReducer<AppState>({
    age: 31,
    name: 'John',
    car: {
      brand: 'Ford',
      model: 'Focus',
    }
  },
  on(changeName, (state, action) => ({...state, name: action.payload})),
  on(changeAge, (state, action) => ({...state, age: action.payload})),
  on(changeCarBrand, (state, action) => ({...state, car: {...state.car, brand: action.payload}})),
  on(changeCarModel, (state, action) => ({...state, car: {...state.car, model: action.payload}})),
);

Deno.test('Store Reducer', async (ctx) => {

  await ctx.step('Should match reducer type', () => {
    const type = Symbol('type');
    const action = createAction(type);
    const target = 'new.value';

    interface State {
      foo: string;
    }

    const reducerAction = on<State>(action, s => ({...s, foo: target}));
    const result = reducerAction.apply({foo: 'old.value'}, action());

    assertEquals(result.foo, target);
    assertEquals(reducerAction.type, type);
  });

  await ctx.step('Should match reducer payload', () => {
    interface State {
      foo: string;
    }

    interface Payload {
      value: string;
    }

    const type = Symbol('type');
    const action = createAction<Payload>(type);
    const payload = {value: 'new.value'};

    const reducerAction = on<State, Payload>(action, (s, a) => ({...s, foo: a.payload.value}));
    const result = reducerAction.apply({foo: 'old.value'}, action(payload));

    assertEquals(result.foo, payload.value);
    assertEquals(reducerAction.type, type);
  });

  await ctx.step('Should set reducer name', () => {
    const reducer = getReducer();
    const name = 'AppState';

    reducer.setName(name);

    assertEquals(reducer.name, name);
  });

  await ctx.step('Should reset reducer state', () => {
    const reducer = getReducer();
    const newState: AppState = {
      age: 32,
      name: 'Jane',
      car: {
        brand: 'Toyota',
        model: 'Corolla',
      }
    };

    reducer.resetState(newState);

    assertEquals(reducer.state.value.age, newState.age);
    assertEquals(reducer.state.value.name, newState.name);
    assertEquals(reducer.state.value.car.brand, newState.car.brand);
    assertEquals(reducer.state.value.car.model, newState.car.model);
  });

  await ctx.step('Should throw if try to change state', () => {
    const reducer = getReducer();

    const state = reducer.state;

    assertThrows(() => { state.value.age = 32; });
    assertThrows(() => { state.value.name = 'Jane'; });
    assertThrows(() => { state.value.car.brand = 'Toyota'; });
    assertThrows(() => { state.value.car.model = 'Corolla'; });
    assertThrows(() => { state.value.car = {brand: 'Toyota', model: 'Corolla'}; });
  });

  await ctx.step('Should apply action changes', () => {
    const reducer = getReducer();

    reducer.apply(changeName('Jane'));
    reducer.apply(changeAge(32));
    reducer.apply(changeCarBrand('Toyota'));
    reducer.apply(changeCarModel('Corolla'));

    assertEquals(reducer.state.value.age, 32);
    assertEquals(reducer.state.value.name, 'Jane');
    assertEquals(reducer.state.value.car.brand, 'Toyota');
    assertEquals(reducer.state.value.car.model, 'Corolla');
  });

  await ctx.step('Should notify on state change', () => {
    const reducer = getReducer();
    const expectedName = 'Jane';
    let name = '';

    reducer.state.subscribe({
      next: s => name = s.name,
    });

    reducer.apply(changeName(expectedName));

    assertEquals(name, expectedName);
  });

  await ctx.step('Should not notify on actions that don\'t change state', () => {
    const reducer = getReducer();
    let callCount = 0;

    reducer.state.subscribe({
      next: _ => callCount++,
    });

    reducer.apply(changeName(reducer.state.value.name));

    assertEquals(callCount, 1); // Is called once on init
  });
});
