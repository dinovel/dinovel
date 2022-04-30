import type { TabItem } from 'dinovel/widgets/__.ts';
import { ResourceState } from 'dinovel/server/modules/resources/models.ts';
import { createReducer, on } from 'dinovel/std/store/reducer.ts';
import { createAction } from 'dinovel/std/store/action.ts';
import { uuid } from 'dinovel/std/crypto.ts';
import { basename } from 'deno/path/mod.ts';

export type ResourcesViewState = {
  resources: Partial<ResourceState>;
  activeTab: string,
  selected: string,
  tabs: ResourcesTabs,
}

export type ResourcesTabs = (FileTabItem)[]

export type FileTabItem = TabItem & {
  type: 'file',
  file: string,
}

const P = (m: string) => `[RESOURCES]>${m}`;

/* Set tab to active for given id */
export const setActiveTab = createAction<string>(P('setActiveTab'));
/* Set resource collection */
export const setResources = createAction<ResourceState>(P('setResources'));
/* Add new tab */
export const addFileTab = createAction<string>(P('addFileTab'));
/* Close tab */
export const closeTab = createAction<string>(P('closeTab'));
/* Add new resource group */
export const addResourceGroup = createAction<string>(P('addResourceGroup'));

export const resourcesViewReducer = createReducer<ResourcesViewState>({
    tabs: [],
    activeTab: '',
    selected: '',
    resources: {},
  },
  on(setActiveTab, (s, a) => ({ ...s, activeTab: a.payload })),
  on(setResources, (s, a) => ({...s, resources: a.payload })),
  on(closeTab, (s, { payload }) => {
    const tabs = s.tabs.filter(t => t.id !== payload);
    return { ...s, tabs };
  }),
  on(addFileTab, (s, { payload }) => {
    if (s.tabs.find(t => t.file === payload)) {
      return s;
    }

    const newTab: FileTabItem = {
      id: uuid(),
      name: basename(payload),
      file: payload,
      type: 'file',
      closeable: true
    };

    const tabs = [
      ...s.tabs,
      newTab
    ];

    return { ...s, tabs, activeTab: newTab.id };
  }),
  on(addResourceGroup, (s, { payload }) => {
    const appRes = {
      ...(s.resources.resMap ?? {}),
    }
    if (appRes[payload]) { return s; }
    appRes[payload] = {};

    return {
      ...s,
      resources: {
        ...s.resources,
        resMap: appRes
      },
    }
  }),
);
