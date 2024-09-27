import {InferTranslatorPhrase} from './infer';
import {buildDoubleBracePhrase} from './phrase-builder';

type UnionToString<T extends string> = {
  [K in T]: Exclude<T, K> extends never ? K : `${K}${UnionToString<Exclude<T, K>>}`;
}[T];

type ValueOf<Config extends Record<string, string>> = Config[keyof Config];
type InferConfigPhrase<
  T extends string,
  Config extends SelectConfig,
> = `{{${T}}}${string}${UnionToString<ValueOf<Config>>}`;

export const select = <T extends string, Config extends SelectConfig>(
  variable: T,
  config: Config,
): InferConfigPhrase<T, Config> => {
  return {
    [SELECT_KEY]: {variable, config},
  } as unknown as InferConfigPhrase<T, Config>;
};

export const SELECT_KEY = 'select-key';
export type SelectConfig = {
  [key: string]: string;
  other: string;
};

export const getSelectPhraseBuilder = <T extends string, Config extends SelectConfig>(selectKey: {
  variable: T;
  config: Config;
}): InferTranslatorPhrase<InferConfigPhrase<T, Config>> => {
  // @ts-expect-error
  return (variables: Record<string, string | number>) => {
    const value = variables[selectKey.variable];
    const selectedPhrase = selectKey.config[value] || selectKey.config['other'];
    return buildDoubleBracePhrase(selectedPhrase, variables);
  };
};
