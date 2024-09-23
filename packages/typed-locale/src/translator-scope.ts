import {InferTranslationGenerator} from './infer';
import {Translator} from './translator';

export const getTranslatorScope = <Translation extends Record<string, unknown>, Scope extends Record<string, unknown>>(
  translator: Translator<Translation>,
  getScope: (translator: InferTranslationGenerator<Translation>) => InferTranslationGenerator<Scope>,
): Translator<Scope> => {
  return (getPhrase: (translation: InferTranslationGenerator<Scope>) => string) => {
    return translator(t => getPhrase(getScope(t)));
  };
};
