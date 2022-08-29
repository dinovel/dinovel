export interface IReporter {
  stdout(src: string, message: string): void;
  stderr(src: string, message: string): void;
}
