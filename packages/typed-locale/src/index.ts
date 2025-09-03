export type {InferPartialTranslation, InferTranslation} from './infer';
export type {OptionsGenerator, TranslationOption} from './options-generator';
export type {Translator} from './translator';
export type {TranslationIssue} from './zod-utils';

export {createLazyTranslator} from './lazy-translator';
export {createOptionsGenerator} from './options-generator';
export {buildDoubleBracePhrase} from './phrase-builder';
export {plural} from './plural';
export {select} from './select';
export {createTranslator} from './translator';
export {createTranslatorFromDictionary} from './translator-from-dictionary';
export {getTranslatorScope} from './translator-scope';

// Zod utilities (optional - requires Zod as a dependency)
export {createZodError, extractTranslationIssues, renderTranslationIssues, withTranslationMessage} from './zod-utils';
