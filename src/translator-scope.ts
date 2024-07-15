import { Translator } from './translator';

export const getTranslatorScope = <Translation, Scope>(
  translator: Translator<Translation>,
  getScope: (translator: Translation) => Scope,
): Translator<Scope> => {
  return (scope: (scope: Scope) => string, variables?: Record<string, any>) => {
    return translator((t) => scope(getScope(t)), variables);
  };
};
