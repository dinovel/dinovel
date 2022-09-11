import { IFileSystem } from "./fs/__.ts";

export interface DinovelRuntime {
  fs: IFileSystem;
}

export * from "./fs/__.ts";
