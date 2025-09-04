import {InferTranslationGenerator} from './infer';

export type TranslationOption<Translation extends Record<string, unknown>> = (
  translation: InferTranslationGenerator<Translation>,
) => string;

export type OptionsGenerator<Translation extends Record<string, unknown>> = <T extends TranslationOption<Translation>>(
  option: T,
) => T;
