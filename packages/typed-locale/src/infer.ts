export type InferPhrase<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? `${string}{{${Param}}}${InferPhrase<Rest>}`
  : string;

export type InferTranslation<T> = {
  [K in keyof T]: T[K] extends string
    ? InferPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferTranslation<T[K]>
      : never;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type InferPartialTranslation<T> = DeepPartial<T>;

export type InferParams<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? {[K in Param | keyof InferParams<Rest>]: string | number}
  : {};

export type InferTranslatorPhrase<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? (props: {[K in Param | keyof InferParams<Rest>]: string | number}) => string
  : string;

export type InferTranslationGenerator<T> = {
  [K in keyof T]: T[K] extends string
    ? InferTranslatorPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferTranslationGenerator<T[K]>
      : never;
};
