import { createAction } from 'dinovel/std/store/action.ts';
import { createReducer, on } from "dinovel/std/store/reducer.ts";

export type LoadingStatus = 'loading' | 'ready' | 'error' | 'initial';

export type LoadingState = {
  status: LoadingStatus;
  errorMessage?: string;
};


export const setStatusLoading = createAction<void>('setStatusLoading');
export const setStatusReady = createAction<void>('setStatusReady');
export const setStatusError = createAction<string>('setStatusError');
export const setStatusInitial = createAction<void>('setStatusInitial');

export const loadingReducers = createReducer<LoadingState>(
  { status: 'initial' },
  on(setStatusLoading, (s) => ({ ...s, status: 'loading' })),
  on(setStatusReady, (s) => ({ ...s, status: 'ready' })),
  on(setStatusError, (s, a) => ({ ...s, status: 'error', errorMessage: a.payload })),
  on(setStatusInitial, (s) => ({ ...s, status: 'initial' })),
);
