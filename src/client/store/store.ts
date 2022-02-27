import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { navReducer, NavState } from './_nav.ts';

export type AppState = {
  nav: NavState;
};

export const appStore = Dinovel.store.merge<AppState>({
  nav: navReducer,
});
