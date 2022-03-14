import { parse } from 'deno/path/mod.ts';
import { walkUp } from './walk-up.ts';

/**
 * Find the root folder for corrent file
 * @param current Current file path (import.meta.url)
 * @param fileName File name that identifies the root folder
 */
export async function findRootPath(current: string, fileName = ''): Promise<string> {
  current = current.replace('file:///', '');
  const parsed = parse(current);
  if (parsed.root === parsed.dir || fileName === '') return parsed.root;

  for await (const entry of walkUp(parsed.dir, { includeDirs: false, includeFiles: true })) {
    if (entry.isFile && fileName.indexOf(entry.name) === 0) {
      return parse(entry.path).dir;
    }
  }

  return parsed.root;
}
