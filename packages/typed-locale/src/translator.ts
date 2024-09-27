import {InferTranslationGenerator} from './infer';
import {getPhraseBuilder} from './phrase-builder';
import {getSelectPhraseBuilder, SELECT_KEY} from './select';

export type Translator<Translation extends Record<string, unknown>> = (
  getPhrase: (translation: InferTranslationGenerator<Translation>) => string,
) => string;

export const createTranslator =
  <Translation extends Record<string, unknown>>(translation: Translation): Translator<Translation> =>
  getPhrase => {
    const generator = getTranslationGenerator(translation);
    return getSafePhrase(getPhrase, generator);
  };

export const getTranslationGenerator = <Translation extends Record<string, unknown>>(
  translation: Translation,
): InferTranslationGenerator<Translation> => {
  const generator = {} as InferTranslationGenerator<Translation>;

  const keys = Object.keys(translation);
  for (const key of keys) {
    const value = translation[key];
    if (typeof value === 'string') {
      // @ts-expect-error
      generator[key] = getPhraseBuilder(value);
    } else if (!!value && typeof value === 'object') {
      const nestedKeys = Object.keys(value);
      const nestedKey = nestedKeys[0];
      if (nestedKey === SELECT_KEY) {
        // @ts-expect-error
        generator[key] = getSelectPhraseBuilder(value[SELECT_KEY] as Translation);
      } else {
        // @ts-expect-error
        generator[key] = getTranslationGenerator(value as Translation);
      }
    }
  }
  return generator;
};

export const getSafePhrase = <Translation extends Record<string, unknown>>(
  getPhrase: (translation: InferTranslationGenerator<Translation>) => string,
  generator: InferTranslationGenerator<Translation>,
): string => {
  try {
    const phrase = getPhrase(generator);
    if (typeof phrase === 'function') {
      // @ts-expect-error
      return phrase();
    }
    return phrase || '';
  } catch (error) {
    return '';
  }
};
