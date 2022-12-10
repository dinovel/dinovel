import { PersistentWebSocket } from './persistent-socket.ts';

interface Message {
  type: string;
}

export class EventHandler {
  #socket: PersistentWebSocket;
  #open = false;
  #logEvents: boolean;
  #listners: Map<string, ((message: Message) => void)[]> = new Map();
  #timeout = new Map<string, number>();
  #broadcast = new BroadcastChannel('dinovel_dev');

  constructor(socket: PersistentWebSocket, logEvents: boolean = true) {
    this.#socket = socket;
    this.#logEvents = logEvents;
  }

  public listen(event: string, handler: (message: Message) => void): void {
    if (!this.#listners.has(event)) {
      this.#listners.set(event, []);
    }

    this.#listners.get(event)?.push(handler);
  }

  public listAll(handler: (message: Message) => void): void {
    this.listen('*', handler);
  }

  public start(): void {
    if (this.#open) return;

    this.#open = true;
    this.#socket.listen((message) => this.#handle(message));
    this.#socket.start();
  }

  #handle(message: string): void {
    const data = this.#parse(message);
    if (!data) return;

    this.#clearTimout(data.type);
    this.#log('log', 'Received event', data);

    setTimeout(() => {
      this.#listners.get('*')?.forEach((h) => h(data));
      this.#listners.get(data.type)?.forEach((h) => h(data));
      this.#broadcast.postMessage(data);
    }, 300);
  }

  #parse(message: string): Message | undefined {
    try {
      return JSON.parse(message);
    } catch (e) {
      this.#log('error', 'Failed to parse message', e);
      return undefined;
    }
  }

  #log(type: 'log' | 'warn' | 'error', ...args: unknown[]): void {
    if (this.#logEvents) {
      console[type](...args);
    }
  }

  #clearTimout(event: string): void {
    const timeout = this.#timeout.get(event);
    if (timeout) {
      clearTimeout(timeout);
      this.#timeout.delete(event);
    }
  }
}
