export interface SaveModule<T = unknown> {
  id: string;
  load: (state?: T) => Promise<void> | void;
  save: () => Promise<T> | T;
}

/** Handle save states */
export interface ISaveHandler {
  createSaveSate(): Promise<string>;
  loadSaveState(data: string): Promise<void>;

  register(...modules: SaveModule[]): void;
}
