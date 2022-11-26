import { m } from './dep.ts';

export * as m from 'deno/testing/mock.ts';

export function fn<T>(call?: () => T): m.Spy {
  return m.spy(call ?? (() => undefined));
}

export function mock<T>(base?: Partial<T>): Mock<T> {
  return new Mock<T>(base);
}

export class Mock<T> {
  #proxyMap = new Map<keyof T, unknown>();

  constructor(base?: Partial<T>) {
    const obj = (base ?? {}) as T;
    // deno-lint-ignore no-explicit-any
    for (const k of Object.keys(obj as any)) {
      this.#proxyMap.set(k as keyof T, obj[k as keyof T]);
    }
  }

  stubValue(prop: keyof T, value: unknown): this {
    this.#proxyMap.set(prop, value);
    return this;
  }

  stubResult(prop: keyof T, result: unknown): this {
    this.#proxyMap.set(prop, m.spy(() => result));
    return this;
  }

  assertWasCalled(prop: keyof T, times = 1): void {
    m.assertSpyCalls(this.#proxyMap.get(prop) as m.Spy, times);
  }

  assertWasNotCalled(prop: keyof T): void {
    const proxyProp = this.#proxyMap.get(prop);
    if (proxyProp === undefined) return;
    m.assertSpyCalls(proxyProp as m.Spy, 0);
  }

  assertWasCalledWith(prop: keyof T, ...args: unknown[]): void {
    m.assertSpyCall(this.#proxyMap.get(prop) as m.Spy, 0, {
      args,
    });
  }

  assertWasCalledAtWith(prop: keyof T, at: number, ...args: unknown[]): void {
    m.assertSpyCall(this.#proxyMap.get(prop) as m.Spy, at, {
      args,
    });
  }

  build(): T {
    return new Proxy({}, {
      get: (_, prop) => {
        const v = this.#proxyMap.get(prop as keyof T);
        if (v !== undefined) {
          return v;
        }

        const fnValue = fn();
        this.#proxyMap.set(prop as keyof T, fnValue);
        return fnValue;
      },
    }) as unknown as T;
  }
}
