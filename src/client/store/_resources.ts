import type { Tabs } from 'dinovel/widgets/__.ts';
import { ResourceState } from 'dinovel/server/modules/resources/models.ts';
import { createReducer, on } from 'dinovel/std/store/reducer.ts';
import { createAction } from 'dinovel/std/store/action.ts';

export type ResourcesViewState = {
  resources: Partial<ResourceState>;
  activeTab: string,
  tabs: Tabs,
}

const P = (m: string) => `[RESOURCES]>${m}`;

export const setActiveTab = createAction<string>(P('setActiveTab'));
export const setResources = createAction<ResourceState>(P('setResources'));

export const resourcesViewReducer = createReducer<ResourcesViewState>({
    tabs: [],
    activeTab: '',
    resources: {},
  },
  on(setActiveTab, (s, a) => ({ ...s, activeTab: a.payload })),
  on(setResources, (s, a) => ({...s, resources: a.payload })),
);
