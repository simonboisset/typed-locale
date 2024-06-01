import { expect, test } from 'vitest';
import { createTranslator } from '.';

const en = {
  hello: 'Hello',
  helloName: 'Hello, {{name}}',
  goodbye: 'Goodbye',
  youHaveOneMessage: 'You have 1 message',
  youHaveManyMessages: 'You have {{count}} messages',
};

type Translation = typeof en;

const fr: Translation = {
  hello: 'Bonjour',
  helloName: 'Bonjour, {{name}}',
  goodbye: 'Au revoir',
  youHaveOneMessage: 'Vous avez 1 message',
  youHaveManyMessages: 'Vous avez {{count}} messages',
};

const dictionary = { en, fr };

const translateEn = createTranslator({ dictionary, locale: 'en' });
const translateFr = createTranslator({ dictionary, locale: 'fr' });

test('Should translate correctly', () => {
  expect(translateEn((l) => l.hello)).toBe('Hello');
  expect(translateFr((l) => l.hello)).toBe('Bonjour');
});

test('Should translate correctly with variables', () => {
  expect(translateEn((l) => l.helloName, { name: 'John' })).toBe('Hello, John');
  expect(translateFr((l) => l.helloName, { name: 'John' })).toBe('Bonjour, John');
});

test('Should translate correctly with variables', () => {
  expect(translateEn((l) => l.youHaveOneMessage)).toBe('You have 1 message');
  expect(translateEn((l) => l.youHaveManyMessages, { count: 2 })).toBe('You have 2 messages');
  expect(translateFr((l) => l.youHaveOneMessage)).toBe('Vous avez 1 message');
  expect(translateFr((l) => l.youHaveManyMessages, { count: 2 })).toBe('Vous avez 2 messages');
});
