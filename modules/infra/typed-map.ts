export class TypedMap<T> {
  #value: Partial<T>;

  constructor(value?: Partial<T>) {
    this.#value = value ?? {};
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.#value[key] = value;
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.#value[key];
  }

  has<K extends keyof T>(key: K): boolean {
    return key in this.#value;
  }

  delete<K extends keyof T>(key: K): void {
    delete this.#value[key];
  }

  get value(): Readonly<Partial<T>> {
    return { ...this.#value };
  }

  public static create = <T = Record<symbol, unknown>>(value?: Partial<T>) => new TypedMap<T>(value);
}
