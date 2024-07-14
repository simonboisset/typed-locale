import { buildDoubleBracePhrase } from './phrase-builder';
import { overridePhraseIfPlural } from './plural';

type InferParams<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? { [K in Param | keyof InferParams<Rest>]: string | number }
  : {};

export type Translator<Translation> = <Phrase extends string>(
  getPhrase: (translation: Translation) => Phrase,
  variables?: InferParams<Phrase>,
) => string;

export const createTranslator =
  <Translation>(translation: Translation): Translator<Translation> =>
  (getPhrase, variables) => {
    const phraseWithoutVariables = overridePhraseIfPlural(getSafePhrase(getPhrase, translation), variables);
    const phraseWithVariables = buildDoubleBracePhrase(phraseWithoutVariables, variables);
    return phraseWithVariables;
  };

export const getSafePhrase = <Translation>(
  getPhrase: (translation: Translation) => string,
  translation: Translation,
) => {
  try {
    return getPhrase(translation) || '';
  } catch (error) {
    return '';
  }
};
