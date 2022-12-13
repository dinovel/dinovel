import { LocaleCode, LocaleKeys, LocaleLoader, LocaleText } from './models.ts';
import type { ILogger, ILoggerFactory } from '../logger/mod.ts';

/** handles I18N values */
export interface I18nHandler<T extends LocaleText> {
  /** List available entries */
  list(): Readonly<LocaleCode>[];
  /** Set locale to use */
  setLocale(localeCode: string): Promise<void>;
  /** Get locale in use */
  getLocale(): Readonly<LocaleCode>;
  /** Get value for entry */
  getByKey<K extends LocaleKeys<T>>(key: K): T[K];

  /** Return map for i18n */
  readonly instance: Readonly<T>;
}

export class I18N<T extends LocaleText> implements I18nHandler<T> {
  #locales = new Map<string, LocaleCode>();
  #locale?: string;
  #instance?: T;
  #loader: LocaleLoader;
  #logger: ILogger;

  constructor(
    logger: ILoggerFactory,
    locales: LocaleCode[],
    loader: LocaleLoader,
  ) {
    this.#logger = logger.createLogger('i18n');
    this.#loader = loader;
    for (const locale of locales) {
      if (this.#locales.has(locale.code)) {
        this.#logger.warn(`Locale ${locale.code} already exists`);
        continue;
      }
      this.#locales.set(locale.code, locale);
    }
  }

  list(): Readonly<LocaleCode>[] {
    return [...this.#locales.values()];
  }

  async setLocale(localeCode: string): Promise<void> {
    if (this.#locale === localeCode) {
      this.#logger.debug(`Locale already set to ${localeCode}`);
      return;
    }
    if (!this.#locales.has(localeCode)) {
      this.#logger.warn(`Locale ${localeCode} not found`);
      return;
    }
    try {
      const intance = await this.#loader.load(localeCode) as T;

      if (!intance) {
        this.#logger.warn(`Locale ${localeCode} not found`);
        return;
      }

      this.#locale = localeCode;
      this.#instance = intance;
      this.#logger.debug(`Locale set to ${localeCode}`);
    } catch (error) {
      this.#logger.error(`Error loading locale ${localeCode}: ${error}`);
    }
  }

  getLocale(): Readonly<LocaleCode> {
    if (!this.#locale) {
      throw new Error('Locale not set');
    }
    return this.#locales.get(this.#locale)!;
  }

  getByKey<K extends LocaleKeys<T>>(key: K): T[K] {
    if (!this.#instance) {
      throw new Error('Locale not set');
    }
    return this.#instance[key];
  }

  get instance(): Readonly<T> {
    if (!this.#instance) {
      throw new Error('Locale not set');
    }
    return new Proxy({} as T, {
      get: (_, key: string) => {
        if (!this.#instance) {
          throw new Error('Locale not set');
        }
        return this.#instance[key];
      },
      set: () => {
        throw new Error('Cannot change locale values directly');
      },
    });
  }
}
