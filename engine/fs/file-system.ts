import { FolderType } from './folders.ts';

/** FileSystem to be used by engine */
export interface IFileSystem {
  /** Implementation type */
  type: string;
  /**
   * Build an url that can be used to access a file in the filesystem
   *
   * @param path Path to file
   * @param folder Folder to which file belongs
   */
  buildUrl(path: string, folder?: FolderType): string | Promise<string>;
  /**
   * Check if a file exists in the filesystem
   *
   * @param path Path to file
   * @param folder Folder to which file belongs
   */
  exists(path: string, folder?: FolderType): boolean | Promise<boolean>;
  /**
   * Write text to file
   *
   * @param path Path to file
   * @param text Content of file
   * @param folder Folder to which file belongs
   */
  writeFileText(path: string, text: string, folder?: FolderType): Promise<void>;
  /**
   * Write binary data to file
   *
   * @param path Path to file
   * @param data content of file
   * @param folder Folder to which file belongs
   */
  writeFileBinary(path: string, data: Uint8Array, folder?: FolderType): Promise<void>;
  /**
   * Read text from file
   *
   * @param path Path to file
   * @param folder Folder to which file belongs
   */
  readFileText(path: string, folder?: FolderType): Promise<string>;
  /**
   * Read binary data from file
   *
   * @param path Path to file
   * @param folder Folder to which file belongs
   */
  readFileBinary(path: string, folder?: FolderType): Promise<Uint8Array>;
}
