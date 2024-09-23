// Double braces syntax: {{variable}}

import {InferTranslatorPhrase} from './infer';

// Replace {{variable}} with value
export const buildDoubleBracePhrase = (phrase: string, variables?: Record<string, string | number>) => {
  if (!variables) return phrase;
  return phrase.replace(/{{(\w+)}}/g, (_, key) => variables[key]?.toString() || `{{${key}}}`);
};

export const getPhraseBuilder = <Phrase extends string>(phrase: Phrase): InferTranslatorPhrase<Phrase> => {
  const hasVariables = /{{(.*?)}}/g.test(phrase);
  if (!hasVariables) {
    // @ts-expect-error
    return phrase;
  }
  // @ts-expect-error
  return (variables: Record<string, string | number>) => buildDoubleBracePhrase(phrase, variables);
};
