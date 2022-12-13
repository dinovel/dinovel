import { Container, createToken, Token } from '../infra/mod.ts';
import { I18N, I18nHandler } from './handler.ts';
import { LocaleCode, LocaleLoader, LocaleText } from './models.ts';
import { LoggerFactoryService } from '../logger/service.ts';

export const i18nLocales = createToken<LocaleCode[]>('I18nLocales', true);
export const i18nLoader = createToken<LocaleLoader>('I18nLoader', true);

export function registerLocales(
  target: Container,
  locales: LocaleCode[],
): void {
  target.registerValue(i18nLocales, locales);
}

export function registerLoader(
  target: Container,
  loader: LocaleLoader,
): void {
  target.registerValue(i18nLoader, loader);
}

export function registerI18n<T extends LocaleText = LocaleText>(target: Container): Token<I18nHandler<T>> {
  const token = createToken<I18nHandler<T>>('I18nHandler', true);

  target.register({
    token,
    factory: [LoggerFactoryService, i18nLocales, i18nLoader, I18N],
  });

  return token;
}

export function registerI18nServices<T extends LocaleText = LocaleText>(
  target: Container,
  locales: LocaleCode[],
  loader: LocaleLoader,
): Token<I18nHandler<T>> {
  registerLocales(target, locales);
  registerLoader(target, loader);
  return registerI18n(target);
}
