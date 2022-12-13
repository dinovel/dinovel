export interface LocaleCode {
  code: string;
  name: string;
}

export type LocaleText = {
  [key: string]: string;
};

export type LocaleKeys<T extends LocaleText> = keyof T;

export interface LocaleLoader {
  load(localeCode: string): Promise<LocaleText> | LocaleText;
}
