import { buildDoubleBracePhrase } from 'phrase-builder';

export type Dictionary<Locale extends string, Translation> = Record<Locale, Translation>;
export type TranslatorParams<Locale extends string, Translation> = {
  dictionary: Dictionary<Locale, Translation>;
  locale: Locale;
};

export const createTranslator =
  <Locale extends string, Translation>({ dictionary, locale }: TranslatorParams<Locale, Translation>) =>
  <Phrase>(
    getPhrase: (translation: Translation) => Phrase,
    ...options: Phrase extends string ? (InferParams<Phrase> extends null ? [] : [InferParams<Phrase>]) : []
  ): string => {
    const params = options.length > 0 ? options[0] || undefined : undefined;
    const phraseWithoutVariables = getPhrase(dictionary[locale]) as string;
    const phraseWithVariables = buildDoubleBracePhrase(phraseWithoutVariables, params);
    return phraseWithVariables;
  };

export type InferParams<T extends string> = string extends T
  ? null
  : T extends `${string}{{${infer Param}}}${infer Rest}`
    ? { [K in Param | keyof InferParams<Rest>]: string | number }
    : null;

type InferPhrase<T extends string> = string extends T
  ? string
  : T extends `${string}{{${infer Param}}}${infer Rest}`
    ? `${string}{{${Param}}}${InferPhrase<Rest>}`
    : string;

export type InferTranslation<T> = {
  [K in keyof T]: T[K] extends string
    ? InferPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferTranslation<T[K]>
      : never;
};
