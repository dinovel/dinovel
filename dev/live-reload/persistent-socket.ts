export class PersistentWebSocket {
  #toSend: string[] = [];
  #toHandle: string[] = [];
  #handlers: ((e: string) => void)[] = [];
  #url: string;
  #ws?: WebSocket;
  #logEvents: boolean;
  #ready = false;
  #interval: number;

  constructor(url: string, interval = 1000, log: boolean = true) {
    this.#url = url;
    this.#logEvents = log;
    this.#interval = interval;
  }

  public listen(handler: (message: string) => void): void {
    this.#handlers.push(handler);
    this.#toHandle.forEach(handler);
    this.#toHandle = [];
  }

  public send(message: string): void {
    if (this.#ready && this.#ws) {
      this.#log('log', 'Sending message', message);
      this.#ws.send(message);
    } else {
      this.#log('warn', 'Queueing message', message);
      this.#toSend.push(message);
    }
  }

  public start(): void {
    this.#init();
  }

  #init(): void {
    try {
      const wsURL = window.location.origin.replace(/^http/, 'ws') + this.#url;
      console.debug('Connecting to persistent socket', wsURL);
      this.#ws = new WebSocket(wsURL);
      this.#ws.onopen = () => {
        this.#log('log', 'Connected to persistent socket');
        this.#ready = true;

        this.#toSend.forEach((m) => this.send(m));
        this.#toSend = [];
      };
      this.#ws.onmessage = (e) => this.#receive(e.data);
      this.#ws.onerror = (e) => {
        this.#log('error', 'Persistent socket error', e);
        this.#restart();
      };
      this.#ws.onclose = () => {
        this.#log('warn', 'Persistent socket closed');
        this.#restart();
      };
    } catch (e) {
      this.#log('error', 'Failed to initialize websocket', e);
      this.#restart();
    }
  }

  #restart(): void {
    this.#ready = false;
    this.#ws?.close();

    setTimeout(() => {
      this.#log('log', 'Restarting persistent socket');
      this.#init();
    }, this.#interval);
  }

  #receive(message: string): void {
    try {
      this.#log('log', 'Received message', message);

      if (this.#handlers.length) {
        this.#handlers.forEach((h) => h(message));
      } else {
        this.#toHandle.push(message);
      }
    } catch (e) {
      this.#log('error', 'Failed to parse message', message, e);
    }
  }

  #log(type: keyof Console, ...args: unknown[]): void {
    if (this.#logEvents) {
      (console[type] as unknown as (...args: unknown[]) => void)(...args);
    }
  }
}
