import type { Store } from 'dinovel/std/store/store.ts';
import type { StoreState } from "dinovel/std/store/models.ts";
import { Dinovel } from 'dinovel/engine/dinovel.ts';

export function useStoreStorage<T extends StoreState>(store: Store<T>, key: string): void {
  store.change.subscribe({
    next: () => {
      const nextState = store.export();
      localStorage.setItem(key, nextState);
      Dinovel.logger.engine('Store state saved to localStorage');
    }
  });

  const currentState = localStorage.getItem(key);
  if (!currentState) {
    Dinovel.logger.engine('No store state found in localStorage');
    return;
  }

  try {
    store.import(currentState);
    Dinovel.logger.engine('Store state loaded from localStorage');
  } catch (e) {
    Dinovel.logger.error(`Error loading store state from localStorage: `, e);
  }
}
