import { DirMap, ResourceState } from './models.ts';
import { walk } from 'deno/fs/mod.ts';
import { parse, basename } from 'deno/path/mod.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { DefaultCategories, DefaultExtensions } from 'dinovel/engine/resources/__.ts';

export async function readResources(): Promise<ResourceState> {
  const rootAssets = Dinovel.runtime.config.server.assets;
  const fileMap = await buildResourcesDirectoryMap(rootAssets, getExtension());

  return {
    files: fileMap,
    resources: {},
    resMap: {},
    categories: DefaultCategories,
    extensions: DefaultExtensions,
  }
}

function getExtension(): string[] {
  return Object.values(DefaultExtensions)
    .flatMap(v => v);
}

async function buildResourcesDirectoryMap(path: string, exts: string[], base = ''): Promise<DirMap> {
  const map: DirMap = {};

  for await (const entry of walk(path, { includeDirs: false, includeFiles: true, followSymlinks: false, maxDepth: 1, exts })) {
    if (path === entry.path) { continue; }
    if (entry.isFile) {
      const e = parse(entry.path);
      map[e.base] = base + '/' + e.base;
    }
  }

  for await (const entry of walk(path, { includeDirs: true, includeFiles: false, followSymlinks: true, maxDepth: 1 })) {
    if (basename(path) === basename(entry.path)) { continue; }
    if (entry.isDirectory || entry.isSymlink) {
      map[basename(entry.name)] = await buildResourcesDirectoryMap(entry.path, exts, base + '/' + basename(entry.name));
    }
  }

  return map;
}
