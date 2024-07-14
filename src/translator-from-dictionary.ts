import { buildDoubleBracePhrase } from './phrase-builder';
import { overridePhraseIfPlural } from './plural';
import { getSafePhrase, Translator } from './translator';

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
  (getPhrase, variables) => {
    const phraseWithoutVariables = overridePhraseIfPlural(
      getSafePhrase(getPhrase, dictionary[locale] as any) || getSafePhrase(getPhrase, dictionary[defaultLocale]),
      variables,
    );

    const phraseWithVariables = buildDoubleBracePhrase(phraseWithoutVariables, variables);
    return phraseWithVariables;
  };
