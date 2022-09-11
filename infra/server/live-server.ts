export interface LiveServer {
  port: number;
  start: () => Promise<number>;
  stop: () => Promise<void>;
}
