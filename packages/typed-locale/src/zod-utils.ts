import type {z} from 'zod';
import type {TranslationOption} from './options-generator';
import type {Translator} from './translator';

export type TranslationIssue<Translation extends Record<string, unknown>> = {
  path: (string | number)[];
  message: TranslationOption<Translation>;
  code: string;
};

// Internal registry to store translation options
const translationRegistry = new Map<string, TranslationOption<any>>();
let messageCounter = 0;

export const withTranslationMessage = <Translation extends Record<string, unknown>>(
  option: TranslationOption<Translation>,
): string => {
  const messageId = `__TRANSLATION_MESSAGE_${++messageCounter}__`;
  translationRegistry.set(messageId, option);
  return messageId;
};

export const isTranslationMessage = (message: string): boolean => {
  return message.startsWith('__TRANSLATION_MESSAGE_') && message.endsWith('__');
};

export const getTranslationOption = (messageId: string): TranslationOption<any> | undefined => {
  return translationRegistry.get(messageId);
};

export const extractTranslationIssues = <Translation extends Record<string, unknown>>(
  zodError: z.ZodError,
): {
  translationIssues: TranslationIssue<Translation>[];
  regularIssues: z.ZodIssue[];
} => {
  const translationIssues: TranslationIssue<Translation>[] = [];
  const regularIssues: z.ZodIssue[] = [];

  for (const issue of zodError.issues) {
    if (isTranslationMessage(issue.message)) {
      const translationOption = getTranslationOption(issue.message);
      if (translationOption) {
        translationIssues.push({
          path: issue.path,
          message: translationOption,
          code: issue.code,
        });
      } else {
        regularIssues.push(issue);
      }
    } else {
      regularIssues.push(issue);
    }
  }

  return {translationIssues, regularIssues};
};

export const renderTranslationIssues = <Translation extends Record<string, unknown>>(
  issues: TranslationIssue<Translation>[],
  translator: Translator<Translation>,
): Array<{path: (string | number)[]; message: string; code: string}> => {
  return issues.map(issue => ({
    path: issue.path,
    message: translator(issue.message),
    code: issue.code,
  }));
};

export const createZodError = <Translation extends Record<string, unknown>>(translator: Translator<Translation>) => {
  return (zodError: z.ZodError) => {
    const {translationIssues, regularIssues} = extractTranslationIssues<Translation>(zodError);
    const renderedTranslationIssues = renderTranslationIssues(translationIssues, translator);

    return [
      ...renderedTranslationIssues,
      ...regularIssues.map(issue => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      })),
    ];
  };
};
