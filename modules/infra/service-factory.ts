import { Token } from './token.ts';

export type ServiceFactory0<T> = [new () => T];
export type ServiceFactory1<T, D1> = [Token<D1>, new (d1: D1) => T];
export type ServiceFactory2<T, D1, D2> = [Token<D1>, Token<D2>, new (d1: D1, d2: D2) => T];
export type ServiceFactory3<T, D1, D2, D3> = [Token<D1>, Token<D2>, Token<D3>, new (d1: D1, d2: D2, d3: D3) => T];
export type ServiceFactory4<T, D1, D2, D3, D4> = [
  Token<D1>,
  Token<D2>,
  Token<D3>,
  Token<D4>,
  new (d1: D1, d2: D2, d3: D3, d4: D4) => T,
];
export type ServiceFactory5<T, D1, D2, D3, D4, D5> = [
  Token<D1>,
  Token<D2>,
  Token<D3>,
  Token<D4>,
  Token<D5>,
  new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T,
];

export type ServiceFactory<T, D1 = unknown, D2 = unknown, D3 = unknown, D4 = unknown, D5 = unknown> =
  | ServiceFactory0<T>
  | ServiceFactory1<T, D1>
  | ServiceFactory2<T, D1, D2>
  | ServiceFactory3<T, D1, D2, D3>
  | ServiceFactory4<T, D1, D2, D3, D4>
  | ServiceFactory5<T, D1, D2, D3, D4, D5>;

type ServiceEntry<T> = Token<T> | { token: Token<T> };

export function buildFactory<T, D1 = unknown, D2 = unknown, D3 = unknown, D4 = unknown, D5 = unknown>(
  ...factory:
    | [new () => T]
    | [ServiceEntry<D1>, new (d1: D1) => T]
    | [ServiceEntry<D1>, ServiceEntry<D2>, new (d1: D1, d2: D2) => T]
    | [ServiceEntry<D1>, ServiceEntry<D2>, ServiceEntry<D3>, new (d1: D1, d2: D2, d3: D3) => T]
    | [
      ServiceEntry<D1>,
      ServiceEntry<D2>,
      ServiceEntry<D3>,
      ServiceEntry<D4>,
      new (d1: D1, d2: D2, d3: D3, d4: D4) => T,
    ]
    | [
      ServiceEntry<D1>,
      ServiceEntry<D2>,
      ServiceEntry<D3>,
      ServiceEntry<D4>,
      ServiceEntry<D5>,
      new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T,
    ]
): ServiceFactory<T, D1, D2, D3, D4, D5> {
  const deps = (factory.slice(0, factory.length - 1) as ServiceEntry<unknown>[])
    .map((dep) => (typeof dep === 'symbol' ? dep : dep.token));
  return [...deps, factory[factory.length - 1]] as ServiceFactory<T, D1, D2, D3, D4, D5>;
}

export interface Service<T, D1 = unknown, D2 = unknown, D3 = unknown, D4 = unknown, D5 = unknown> {
  token: Token<T>;
  factory: ServiceFactory<T, D1, D2, D3, D4, D5>;
}
