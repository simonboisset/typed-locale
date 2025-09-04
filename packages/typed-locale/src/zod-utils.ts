import type {z} from 'zod';
import {createDeferredTranslator, isDeferredTranslation} from './deferred-translation';
import type {Translator} from './translator';

export type TranslationIssue = {
  path: (string | number)[];
  message: string;
  code: string;
};

const extractTranslationIssues = <Translation extends Record<string, unknown>>(
  zodError: z.ZodError,
  deferredTranslator: (token: string) => string,
): {
  translationIssues: TranslationIssue[];
  regularIssues: z.ZodIssue[];
} => {
  const translationIssues: TranslationIssue[] = [];
  const regularIssues: z.ZodIssue[] = [];

  for (const issue of zodError.issues) {
    if (isDeferredTranslation(issue.message)) {
      translationIssues.push({
        path: issue.path,
        message: deferredTranslator(issue.message),
        code: issue.code,
      });
    } else {
      regularIssues.push(issue);
    }
  }

  return {translationIssues, regularIssues};
};

export const createZodTranslator = <Translation extends Record<string, unknown>>(
  translator: Translator<Translation>,
) => {
  const deferredTranslator = createDeferredTranslator(translator);
  return (zodError: z.ZodError) => {
    const {translationIssues, regularIssues} = extractTranslationIssues<Translation>(zodError, deferredTranslator);

    return [
      ...translationIssues,
      ...regularIssues.map(issue => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      })),
    ];
  };
};
