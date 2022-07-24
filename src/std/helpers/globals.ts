// deno-lint-ignore-file no-explicit-any
export type GlobalReader<T> = {
  readonly value: T;
  readonly hasInit: boolean;
}

export type GlobalWriter<T> = {
  set(value: T): void;
}

export function createGlobal<T>(key: string | symbol, value?: T): GlobalReader<T> & GlobalWriter<T>;
export function createGlobal<T>(key: string | symbol, initalValue: T, isReadonly: true): GlobalReader<T>
export function createGlobal<T>(key: string | symbol, initalValue: T | undefined, isReadonly?: boolean): GlobalReader<T> & GlobalWriter<T> {
  const initKey = `${key.toString()}_init`;
  const setInit = (s: boolean) => (globalThis as any)[initKey] = s;
  const getInit = () => (globalThis as any)[initKey] === true;

  (globalThis as any)[key] = initalValue;
  setInit(typeof initalValue !== 'undefined');

  const handler = {
    get hasInit() {
      return getInit();
    },
    get value() {
      if (!this.hasInit) {
        throw new Error(`Global ${key.toString()} is not initialized`);
      }
      return (globalThis as any)[key];
    },
    set(value: T) {
      if (isReadonly && getInit()) {
        throw new Error(`Global ${key.toString()} is readonly`);
      }
      setInit(true);
      (globalThis as any)[key] = value;
    }
  }

  return handler;
}
