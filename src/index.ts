import { buildDoubleBracePhrase } from 'phrase-builder';

export type Dictionary<Locale extends string, Translation> = Record<Locale, Translation>;
export type TranslatorParams<Locale extends string, Translation> = {
  dictionary: Dictionary<Locale, Translation>;
  locale: Locale;
};

export const createTranslator =
  <Locale extends string, Translation>({ dictionary, locale }: TranslatorParams<Locale, Translation>) =>
  (getPhrase: (translation: Translation) => string, variables?: Record<string, string | number>) => {
    const phraseWithoutVariables = getPhrase(dictionary[locale]);
    const phraseWithVariables = buildDoubleBracePhrase(phraseWithoutVariables, variables);
    return phraseWithVariables;
  };
