type InferPhrase<T extends string> = T extends `${string}{{${infer Param}}}${infer Rest}`
  ? `${string}{{${Param}}}${InferPhrase<Rest>}`
  : string;

export type InferTranslation<T> = {
  [K in keyof T]: T[K] extends string
    ? InferPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferTranslation<T[K]>
      : never;
};

export type InferPartialTranslation<T> = Partial<{
  [K in keyof T]: T[K] extends string
    ? InferPhrase<T[K]>
    : T[K] extends Record<string, unknown>
      ? InferPartialTranslation<T[K]>
      : never;
}>;
