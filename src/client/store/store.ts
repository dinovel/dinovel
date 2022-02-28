import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { LoadingState, loadingReducers } from "./_loading.ts";
import { navReducer, NavState } from './_nav.ts';
import { ResourcesViewState, resourcesViewReducer } from './_resources.ts';

export type AppState = {
  nav: NavState;
  loading: LoadingState;
  resourcesView: ResourcesViewState;
};

export const appStore = Dinovel.store.merge<AppState>({
  nav: navReducer,
  loading: loadingReducers,
  resourcesView: resourcesViewReducer,
});
