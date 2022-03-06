import { createAction } from 'dinovel/std/store/action.ts';
import { createReducer, on } from "dinovel/std/store/reducer.ts";

export type LoadItem = {
  id: string;
  message: string;
  progress: number | 'indeterminate';
  completed: boolean;
}

export type LoadingState = {
  items: { [id: string]: LoadItem };
  loading: boolean;
};

export interface NewLoadItem {
  id: string;
  message: string;
  progress?: number | 'indeterminate';
}

export interface UpdateLoadItem {
  id: string;
  message?: string;
  progress?: number | 'indeterminate';
}

const P = (m: string) => `[LOADING]>${m}`;

export const startLoading = createAction<NewLoadItem>(P('START_LOADING'));
export const updateLoading = createAction<UpdateLoadItem>(P('UPDATE_LOADING'));
export const completeLoading = createAction<string>(P('COMPLETE_LOADING'));
export const clearLoading = createAction<string>(P('CLEAR_LOADING'));

export const loadingReducers = createReducer<LoadingState>(
  { items: {}, loading: false },

  // Add loading item to the list
  on(startLoading, (s, a) => {
    if (s.items[a.payload.id]) { return s; }

    const item: LoadItem = {
      id: a.payload.id,
      message: a.payload.message,
      progress: a.payload.progress || 'indeterminate',
      completed: false,
    }

    return {
      items: { ...s.items, [a.payload.id]: item },
      loading: true,
    };
  }),

  // Update loading item
  on(updateLoading, (s, a) => {
    if (!s.items[a.payload.id]) { return s; }

    const item = s.items[a.payload.id];
    const newItem = { ...item, ...a.payload };

    return {
      items: { ...s.items, [a.payload.id]: newItem },
      loading: Object.values(s.items).some(i => !i.completed),
    };
  }),

  // Complete loading item
  on(completeLoading, (s, a) => {
    if (!s.items[a.payload]) { return s; }

    const item = s.items[a.payload];
    const newItem = { ...item, completed: true };

    return {
      items: { ...s.items, [a.payload]: newItem },
      loading: Object.values(s.items).some(i => !i.completed),
    };
  }),

  // Clear loading item
  on(clearLoading, (s, a) => {
    const items = { ...s.items };
    delete items[a.payload];

    return {
      items,
      loading: Object.values(items).some(i => !i.completed),
    };
  })
);
