import {expect, test} from 'vitest';
import {createTranslator} from './translator';

const en = {
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
  repeatedVariables: 'Hello, {{name}}! How are you, {{name}}? Have a nice day, {{name}}!',
} as const;

const fr = {
  hello: 'Bonjour',
  helloName: 'Bonjour, {{name}}',
  goodbye: 'Au revoir',
  youHaveOneMessage: 'Vous avez 1 message',
  youHaveManyMessages: 'Vous avez {{count}} messages',
  nested: {
    key: 'Clé profonde',
    keyWithName: 'Clé profonde avec nom {{name}}',
  },
} as const;

const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);

test('Should translate correctly', () => {
  expect(translateEn(l => l.hello)).toBe('Hello');
  expect(translateFr(l => l.hello)).toBe('Bonjour');
});

test('Should translate correctly with variables', () => {
  expect(translateEn(l => l.helloName({name: 'John'}))).toBe('Hello, John');
  expect(translateFr(l => l.helloName({name: 'John'}))).toBe('Bonjour, John');
});

test('Should translate correctly with variables', () => {
  expect(translateEn(l => l.youHaveOneMessage)).toBe('You have 1 message');
  expect(translateEn(l => l.youHaveManyMessages({count: 2}))).toBe('You have 2 messages');
  expect(translateFr(l => l.youHaveOneMessage)).toBe('Vous avez 1 message');
  expect(translateFr(l => l.youHaveManyMessages({count: 2}))).toBe('Vous avez 2 messages');
});

test('Should translate correctly with nested keys', () => {
  expect(translateEn(l => l.nested.key)).toBe('Deep nested key');
  expect(translateEn(l => l.nested.keyWithName({name: 'John'}))).toBe('Deep nested key with name John');
  expect(translateFr(l => l.nested.key)).toBe('Clé profonde');
});

test('Should throw an error if the key does not exist', () => {
  // @ts-expect-error
  expect(translateEn(l => l.nonExistentKey.blabla)).toBe('');
  // @ts-expect-error
  expect(translateEn(l => l.nonExistentKey)).toBe('');
});

test('Should keep initial value when warning is not provided', () => {
  // @ts-expect-error
  expect(translateFr(l => l.helloName)).toBe('Bonjour, {{name}}');
});

test('Should ignore unknown variables', () => {
  // @ts-expect-error
  expect(translateEn(l => l.helloName({name: 'John', age: 30}))).toBe('Hello, John');
});

test('Should use variables multiple times', () => {
  expect(translateEn(l => l.repeatedVariables({name: 'John'}))).toBe(
    'Hello, John! How are you, John? Have a nice day, John!',
  );
});
