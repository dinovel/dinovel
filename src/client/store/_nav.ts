import { createReducer, on } from 'dinovel/std/store/reducer.ts';
import { createAction } from 'dinovel/std/store/action.ts';

export type NavState = {
  current: string;
}

export const navTo = createAction<string>('setNavStateCurrent');

export const navReducer = createReducer<NavState>({
    current: 'home',
  },
  on(navTo, (s, a) => ({ ...s, current: a.payload })),
);
