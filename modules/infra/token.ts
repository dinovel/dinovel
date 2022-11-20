export type Token<T = unknown> = symbol & { __value?: T };

export function createToken<T = unknown>(description?: string): Token<T>;
export function createToken<T = unknown>(description: string, singleton: true): Token<T>;
export function createToken<T = unknown>(description?: string, singleton?: boolean): Token<T> {
  const name = description ?? crypto.randomUUID();
  const token = (singleton && description) ? Symbol.for(name) : Symbol(name);
  return token as Token<T>;
}

export function isSingleton<T = unknown>(token: Token<T>): boolean {
  return typeof Symbol.keyFor(token) === 'string';
}

export const unit = Symbol.for('__UNIT__') as Token<void>;
