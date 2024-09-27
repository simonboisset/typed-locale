import {InferPhrase, InferTranslatorPhrase} from './infer';
import {buildDoubleBracePhrase} from './phrase-builder';

type PluralPhrase = `${string}{{count}}${string}`;

type InferPluralPhrase<Phrase extends string> = Phrase extends `${infer Before}{{count}}${infer Rest}`
  ? `${InferPluralPhrase<Before>}${string}${InferPluralPhrase<Rest>}`
  : Phrase extends `${string}{{${infer Param}}}${infer Rest}`
    ? `${string}{{${Param}}}${InferPluralPhrase<Rest>}`
    : string;

export type PluralConfig<Phrase extends PluralPhrase> = {
  none?: InferPluralPhrase<Phrase>;
  one?: InferPluralPhrase<Phrase>;
  other: Phrase;
};

/**
 * @deprecated
 * Use `select` instead.
 */
export const plural = <Phrase extends PluralPhrase>(config: PluralConfig<Phrase>): InferPhrase<Phrase> => {
  return {
    [PLURALIZED_KEY]: config,
  } as unknown as InferPhrase<Phrase>;
};

export const PLURALIZED_KEY = 'pluralized-key';

export const getPluralizedPhraseBuilder = <Phrase extends PluralPhrase>(
  pluralizedKey: PluralConfig<Phrase>,
): InferTranslatorPhrase<Phrase> => {
  // @ts-expect-error
  return (variables: Record<string, string | number>) => {
    const count = variables.count;
    if (count === 0 && pluralizedKey.none) {
      return buildDoubleBracePhrase(pluralizedKey.none, variables);
    } else if (count === 1 && pluralizedKey.one) {
      return buildDoubleBracePhrase(pluralizedKey.one, variables);
    }
    return buildDoubleBracePhrase(pluralizedKey.other, variables);
  };
};
