import { createReducer, on } from 'dinovel/std/store/reducer.ts';
import { createAction } from 'dinovel/std/store/action.ts';
import { SESSION_KEY_NAV } from '../core/constants.ts';


export type NavState = {
  current: string;
}

export const navTo = createAction<string>('setNavStateCurrent');

export const navReducer = createReducer<NavState>({
    current: sessionStorage.getItem(SESSION_KEY_NAV) || 'home',
  },
  on(navTo, (s, a) => ({ ...s, current: a.payload })),
);
