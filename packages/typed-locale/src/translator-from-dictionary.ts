import {getSafePhrase, getTranslationGenerator, Translator} from './translator';

type CreateTranslatorFromDictionaryParams<
  Dictionary extends Record<string, any>,
  Locale extends keyof Dictionary,
  DefaultLocale extends keyof Dictionary,
> = {
  dictionary: Dictionary;
  defaultLocale: DefaultLocale;
  locale: Locale;
};

export const createTranslatorFromDictionary =
  <Dictionary extends Record<string, any>, Locale extends keyof Dictionary, DefaultLocale extends keyof Dictionary>({
    dictionary,
    defaultLocale,
    locale,
  }: CreateTranslatorFromDictionaryParams<Dictionary, Locale, DefaultLocale>): Translator<Dictionary[DefaultLocale]> =>
  getPhrase => {
    const defaultGenerator = getTranslationGenerator(dictionary[defaultLocale]);
    const localeGenerator = getTranslationGenerator(dictionary[locale]);

    return getSafePhrase(getPhrase, localeGenerator) || getSafePhrase(getPhrase, defaultGenerator);
  };
