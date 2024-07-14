import { InferPhrase } from './infer';

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

export const plural = <Phrase extends PluralPhrase>(config: PluralConfig<Phrase>): InferPhrase<Phrase> => {
  return {
    [PLURALIZED_KEY]: config,
  } as unknown as InferPhrase<Phrase>;
};

export const PLURALIZED_KEY = 'pluralized-key';

export const overridePhraseIfPlural = (
  phrase: string,
  variables:
    | {}
    | {
        [x: string]: string | number;
      }
    | undefined,
) => {
  if (typeof phrase === 'object') {
    const keys = Object.keys(phrase);
    const key = keys[0];
    if (key === PLURALIZED_KEY) {
      // @ts-expect-error
      const count = variables?.count;
      const pluralizedKey = phrase[key] as PluralConfig<any>;
      if (count === 0 && pluralizedKey.none) {
        return pluralizedKey.none;
      } else if (count === 1 && pluralizedKey.one) {
        return pluralizedKey.one;
      } else {
        return pluralizedKey.other;
      }
    }
  }
  return phrase;
};
