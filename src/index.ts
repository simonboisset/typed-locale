import { buildDoubleBracePhrase } from 'phrase-builder';

// Utility types for creating a translator

type InferParams<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? { [K in Param | keyof InferParams<Rest>]: string | number }
  : {};

type Translator<Translation> = <Phrase extends string>(
  getPhrase: (translation: Translation) => Phrase,
  variables?: InferParams<Phrase>,
) => string;

type CreateTranslatorParams<Locale extends string, Translation> = {
  dictionary: Record<Locale, Translation>;
  locale: Locale;
};

export const createTranslator =
  <Locale extends string, Translation>({
    dictionary,
    locale,
  }: CreateTranslatorParams<Locale, Translation>): Translator<Translation> =>
  (getPhrase, variables) => {
    let phraseWithoutVariables: string;
    try {
      phraseWithoutVariables = getPhrase(dictionary[locale]);
    } catch (error) {
      return '';
    }

    if (!phraseWithoutVariables) {
      return '';
    }

    const phraseWithVariables = buildDoubleBracePhrase(phraseWithoutVariables, variables);
    return phraseWithVariables;
  };

// For inferring the translation type

type InferPhrase<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? `${string}{{${Param}}}${InferPhrase<Rest>}`
  : string;

export type InferTranslation<T> = {
  [K in keyof T]: T[K] extends string
    ? InferPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferTranslation<T[K]>
      : never;
};
