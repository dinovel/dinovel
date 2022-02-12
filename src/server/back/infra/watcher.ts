import { expandGlobSync } from 'deno/fs/mod.ts';
import { resolve } from 'deno/path/mod.ts';
import {
  debounce,
  Subject,
} from 'dinovel/std/reactive.ts';

import { serverEvents } from './events.ts';

let hasStarted = false;

export async function startWatcher(paths: string[]): Promise<void> {
  if (!paths.length || hasStarted) { return; }
  const fullPaths: string[] = [];

  for (const path of paths) {
    if (path.indexOf('*') === -1) {
      fullPaths.push(path);
      continue;
    }

    for (const file of expandGlobSync(path, { includeDirs: true })) {
      if (file.isDirectory) {
        fullPaths.push(file.path);
      }
    }
  }

  if (!fullPaths.length) { return; }

  hasStarted = true;

  const subject = new Subject<string[]>();
  subject
    .pipe(debounce(300))
    .subscribe({ next: processFileChanged });


  const watcher = Deno.watchFs(fullPaths);

  serverEvents.emit('watching', fullPaths);

  for await (const event of watcher) {
    subject.next(event.paths);
  }
}

function processFileChanged(paths: string[]) {
  const cleanPaths: string[] = [];

  for (const path of paths) {
    cleanPaths.push(resolve(path));
  }

  serverEvents.emit('fileChanged', cleanPaths);
}
