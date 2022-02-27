import { createReducer } from "dinovel/std/store/reducer.ts";
import { Store } from "dinovel/std/store/store.ts";

export type DinovelStoreState = {
  core: { app: string };
}

const coreReducer = createReducer<{ app: string }>({
  app: 'Dinovel',
});

export const dinovelStore = new Store<DinovelStoreState>({
  core: coreReducer,
});
