import type {z} from 'zod';
import {createOptionsGenerator, type TranslationOption} from './options-generator';
import type {Translator} from './translator';

export type TranslationIssue<Translation extends Record<string, unknown>> = {
  path: (string | number)[];
  message: TranslationOption<Translation>;
  code: string;
};

type MessagePayload = {
  path: (string | number)[];
  variables?: Record<string, string | number>;
};

const TOKEN_PREFIX = '__TRANSLATION_MESSAGE__:';

const encodePayload = (payload: MessagePayload): string => `${TOKEN_PREFIX}${JSON.stringify(payload)}`;
const tryDecodePayload = (token: string): MessagePayload | undefined => {
  if (!token.startsWith(TOKEN_PREFIX)) return undefined;
  const json = token.slice(TOKEN_PREFIX.length);
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

// Create a proxy-based generator that records the accessed path and optional variables
const createRecordingGenerator = (): any => {
  const makeNode = (path: (string | number)[]): any => {
    const handler: ProxyHandler<any> = {
      get(_target, prop) {
        return makeNode([...path, prop as string]);
      },
      apply(_target, _thisArg, argArray) {
        const variables = (argArray && argArray[0]) as Record<string, string | number> | undefined;
        return encodePayload({path, variables});
      },
    };

    // Callable function that also stringifies to a token when not called
    const fn = () => encodePayload({path});
    // Ensure String(fn) yields the token as well
    Object.defineProperty(fn, 'toString', {
      value: () => encodePayload({path}),
    });
    // Wrap in proxy to support both property access and calls
    return new Proxy(fn, handler);
  };
  return makeNode([]);
};

const withTranslationMessage = <Translation extends Record<string, unknown>>(
  option: TranslationOption<Translation>,
): string => {
  const recorder = createRecordingGenerator();
  // Execute option against the recorder and coerce to string if needed
  const result = option(recorder);
  if (typeof result === 'string') return result;
  if (typeof result === 'function') return (result as any)();
  return String(result);
};

const isTranslationMessage = (message: string): boolean => message.startsWith(TOKEN_PREFIX);

const toTranslationOption = (payload: MessagePayload): TranslationOption<any> => {
  return generator => {
    let current: any = generator;
    for (const key of payload.path) current = current?.[key as any];
    if (typeof current === 'function') {
      return current(payload.variables || ({} as any));
    }
    return current ?? '';
  };
};

const extractTranslationIssues = <Translation extends Record<string, unknown>>(
  zodError: z.ZodError,
): {
  translationIssues: TranslationIssue<Translation>[];
  regularIssues: z.ZodIssue[];
} => {
  const translationIssues: TranslationIssue<Translation>[] = [];
  const regularIssues: z.ZodIssue[] = [];

  for (const issue of zodError.issues) {
    if (isTranslationMessage(issue.message)) {
      const payload = tryDecodePayload(issue.message);
      if (payload) {
        const translationOption = toTranslationOption(payload);
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

const renderTranslationIssues = <Translation extends Record<string, unknown>>(
  issues: TranslationIssue<Translation>[],
  translator: Translator<Translation>,
): Array<{path: (string | number)[]; message: string; code: string}> => {
  return issues.map(issue => ({
    path: issue.path,
    message: translator(issue.message),
    code: issue.code,
  }));
};

export const createZodTranslator = <Translation extends Record<string, unknown>>(
  translator: Translator<Translation>,
) => {
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

export const createZodOptions = <Translation extends Record<string, unknown>>(translation: Translation) => {
  const options = createOptionsGenerator(translation);
  return (option: TranslationOption<Translation>) => withTranslationMessage(options(option));
};
