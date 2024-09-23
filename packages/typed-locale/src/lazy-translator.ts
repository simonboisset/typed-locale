import {getDeep, updateDeep} from './deep';
import {extractPath} from './extract-path';
import {DeepPartial, InferTranslationGenerator} from './infer';
import {getTranslationGenerator} from './translator';

export type LazyLoadFunction = (paths: string[]) => Promise<string>;

export type LazyTranslator<Translation extends Record<string, unknown>> = (
  selector: (t: InferTranslationGenerator<Translation>) => string,
) => Promise<string>;

export function createLazyTranslator<T extends Record<string, unknown>>(
  lazyLoadFn: LazyLoadFunction,
  initialTranslations?: DeepPartial<T>,
): LazyTranslator<T> {
  let loadedTranslations: DeepPartial<T> = initialTranslations ? {...initialTranslations} : {};

  const loadTranslations = async (path: string[]): Promise<void> => {
    const value = getDeep(loadedTranslations, path);
    if (value === undefined) {
      const newTranslation = await lazyLoadFn(path);

      loadedTranslations = updateDeep(loadedTranslations, newTranslation, path);
    }
  };

  return async <K extends (t: InferTranslationGenerator<T>) => any>(selector: K): Promise<ReturnType<K>> => {
    const keys = extractPath(selector);
    await loadTranslations(keys);

    const translationGenerator = getTranslationGenerator(loadedTranslations as T);
    const result = selector(translationGenerator);

    if (typeof result === 'function') {
      return result;
    }

    return result;
  };
}
