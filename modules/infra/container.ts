import { isSingleton, Token } from './token.ts';
import { Service, ServiceFactory } from './service-factory.ts';
import { TypedMap } from './typed-map.ts';

export class Container {
  #impl = TypedMap.create<Record<Token<unknown>, unknown>>();
  #fact = TypedMap.create<Record<Token<unknown>, ServiceFactory<unknown>>>();

  public register<T, D1, D2, D3, D4, D5>(service: Service<T, D1, D2, D3, D4, D5>): void {
    this.#validateCanRegisterNew(service.token);
    this.#validateInfinitelyRecursive(service.token, service.factory as ServiceFactory<T>);
    this.#fact.set(service.token, service.factory as ServiceFactory<T>);
  }

  public registerValue<T>(token: Token<T>, value: T): void {
    this.#validateCanRegisterNew(token);
    this.#impl.set(token, value);
  }

  public get<T>(token: Token<T>): T {
    if (this.#impl.has(token)) {
      return this.#impl.get(token) as T;
    }

    const isSingle = isSingleton(token);

    const factory = this.#fact.get(token);
    if (!factory) {
      throw new Error(`Token ${token.description} is not registered`);
    }

    const deps = factory.filter((dep) => typeof dep === 'symbol') as unknown as Token<unknown>[];
    const args: unknown[] = [];
    for (const dep of deps) {
      try {
        args.push(this.get(dep));
      } catch (err) {
        throw new Error(
          `Token ${token.description} has a dependency on ${dep.description} which is not registered: ${err.message}`,
        );
      }
    }
    const T = factory[factory.length - 1] as unknown as new (...args: unknown[]) => T;

    const instance = new T(...args);
    if (isSingle) {
      this.#impl.set(token, instance);
    }
    return instance;
  }

  public reset<T>(token: Token<T>): void {
    this.#impl.delete(token);
  }

  #validateCanRegisterNew<T>(token: Token<T>): asserts token is Token<T> {
    if (!isSingleton(token)) return;

    if (this.#impl.has(token)) {
      throw new Error(`Token ${token.description} is a singleton and is already instantiated`);
    }
  }

  #validateInfinitelyRecursive<T>(token: Token<T>, factory: ServiceFactory<T>): asserts token is Token<T> {
    if (factory.find((dep) => dep === token)) {
      throw new Error(`Token ${token.description} is infinitely recursive`);
    }
  }
}

export const container = new Container();
