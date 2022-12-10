import { EventHandler } from './event-handler.ts';
import { LiveReloadOptions } from './options.ts';
import { PersistentWebSocket } from './persistent-socket.ts';

export class LiveReload {
  #eventHandler: EventHandler;

  constructor(options: LiveReloadOptions) {
    this.#eventHandler = new EventHandler(
      new PersistentWebSocket(options.endpoint, 1000, options.enableLogging),
      options.enableLogging,
    );
    this.#eventHandler.listen(options.reloadEvent, () => {
      this.#reload();
    });
  }

  public start(): void {
    this.#eventHandler.start();
  }

  #reload(): void {
    window.location.reload();
  }
}
