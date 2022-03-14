import { WalkEntry, WalkOptions, walk } from 'deno/fs/mod.ts';
import { parse } from 'deno/path/mod.ts';

/**
 * Walk up through the directory tree and return all files
 * until the root folder is reached
 *
 * @param path Path to start from
 * @param options
 * @returns
 */
export async function* walkUp(path: string, options: WalkOptions = {}): AsyncIterableIterator<WalkEntry> {
  const maxDepth = options.maxDepth ?? -1;
  const _walkOptions: WalkOptions = {
    ...options,
    maxDepth: 1,
  }
  while (true) {
    const walker = walk(path, _walkOptions);
    for await (const entry of walker) {
      yield entry;
    }

    if (maxDepth === 0) return;

    const parsed = parse(path);
    if (parsed.root === path) return;

    path = parsed.dir;
  }
}
