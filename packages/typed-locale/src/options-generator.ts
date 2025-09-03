import {InferTranslationGenerator} from './infer';

export type TranslationOption<Translation extends Record<string, unknown>> = (
  translation: InferTranslationGenerator<Translation>,
) => string;

export type OptionsGenerator<Translation extends Record<string, unknown>> = <
  T extends TranslationOption<Translation>,
>(
  option: T,
) => T;

export const createOptionsGenerator = <Translation extends Record<string, unknown>>(
  _translation: Translation,
): OptionsGenerator<Translation> => {
  return <T extends TranslationOption<Translation>>(option: T): T => {
    return option;
  };
};