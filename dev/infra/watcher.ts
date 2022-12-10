import { debounceTime, Subject, Subscription } from 'rxjs';

export interface WatcherOptions {
  paths: string[];
  extensions: string[];
  action: (changed: string[]) => void | Promise<void>;
}

export class Watcher {
  #paths: string[];
  #extensions: string[];
  #action: (changed: string[]) => void | Promise<void>;
  #subject: Subject<string[]>;

  #watcher?: Deno.FsWatcher;
  #subs?: Subscription;

  constructor(options: WatcherOptions) {
    this.#paths = options.paths.map((e) => this.cleanPath(e));
    this.#extensions = options.extensions;
    this.#action = options.action;
    this.#subject = new Subject();
  }

  async start() {
    if (this.#watcher) return;
    this.#watcher = Deno.watchFs(this.#paths, { recursive: true });

    this.#subs = this.#subject.pipe(
      debounceTime(100),
    ).subscribe((c) => this.#action(c));

    for await (const ev of this.#watcher) {
      const changed = ev.paths.filter((path) => {
        const ext = path.split('.').pop();
        return this.#extensions.includes(ext ?? '*');
      });
      if (changed.length > 0) {
        this.#subject.next(changed);
      }
    }
  }

  stop() {
    this.#subs?.unsubscribe();
    this.#watcher?.close();
    this.#watcher = undefined;
  }

  private cleanPath(path: string) {
    return Deno.build.os === 'windows' ? path.substring(1) : path;
  }
}
