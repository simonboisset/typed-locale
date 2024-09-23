import {expect, test} from 'vitest';
import {createTranslatorFromDictionary} from './translator-from-dictionary';
import {getTranslatorScope} from './translator-scope';

const en = {
  scope: {
    hello: 'Hello',
    helloName: 'Hello, {{name}}',
    goodbye: 'Goodbye',
    youHaveOneMessage: 'You have 1 message',
    youHaveManyMessages: 'You have {{count}} messages',
    nested: {
      key: 'Deep nested key',
      keyWithName: 'Deep nested key with name {{name}}',
    },
    missingKeys: {
      missingKey: 'Missing key',
      missingKeyVariable: 'Missing key with variable {{name}}',
    },
  },
} as const;

const dictionary = {en};

const translateEn = getTranslatorScope(
  createTranslatorFromDictionary({dictionary, locale: 'en', defaultLocale: 'en'}),
  l => l.scope,
);

test('Should translate correctly', () => {
  expect(translateEn(l => l.hello)).toBe('Hello');
});

test('Should translate correctly with variables', () => {
  expect(translateEn(l => l.helloName({name: 'John'}))).toBe('Hello, John');
});

test('Should translate correctly with variables', () => {
  expect(translateEn(l => l.youHaveOneMessage)).toBe('You have 1 message');
  expect(translateEn(l => l.youHaveManyMessages({count: 2}))).toBe('You have 2 messages');
});

test('Should translate correctly with nested keys', () => {
  expect(translateEn(l => l.nested.key)).toBe('Deep nested key');
  expect(translateEn(l => l.nested.keyWithName({name: 'John'}))).toBe('Deep nested key with name John');
});

test('Should throw an error if the key does not exist', () => {
  // @ts-expect-error
  expect(translateEn(l => l.nonExistentKey.blabla)).toBe('');
  // @ts-expect-error
  expect(translateEn(l => l.nonExistentKey)).toBe('');
});

test('Should keep initial value when warning is not provided', () => {
  expect(translateEn(l => l.missingKeys.missingKey)).toBe('Missing key');
});

test('Should ignore unknown variables', () => {
  // @ts-expect-error
  expect(translateEn(l => l.helloName({name: 'John', age: 30}))).toBe('Hello, John');
});

test('Should return default locale if the key does not exist', () => {
  expect(translateEn(l => l.missingKeys.missingKey)).toBe('Missing key');
});

test('Should return default locale with variables if the key does not exist', () => {
  expect(translateEn(l => l.missingKeys.missingKeyVariable({name: 'John'}))).toBe('Missing key with variable John');
});
