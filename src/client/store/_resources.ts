import type { TabItem } from 'dinovel/widgets/__.ts';
import { ResourceState } from 'dinovel/server/modules/resources/models.ts';
import { createReducer, on } from 'dinovel/std/store/reducer.ts';
import { createAction } from 'dinovel/std/store/action.ts';
import { uuid } from 'dinovel/std/crypto.ts';
import { basename } from 'deno/path/mod.ts';

export type ResourcesViewState = {
  resources: Partial<ResourceState>;
  activeTab: string,
  tabs: ResourcesTabs,
}

export type ResourcesTabs = (FileTabItem)[]

export type FileTabItem = TabItem & {
  type: 'file',
  file: string,
}

const P = (m: string) => `[RESOURCES]>${m}`;

export const setActiveTab = createAction<string>(P('setActiveTab'));
export const setResources = createAction<ResourceState>(P('setResources'));
export const addFileTab = createAction<string>(P('addFileTab'));
export const closeTab = createAction<string>(P('closeTab'));

export const resourcesViewReducer = createReducer<ResourcesViewState>({
    tabs: [],
    activeTab: '',
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
);
