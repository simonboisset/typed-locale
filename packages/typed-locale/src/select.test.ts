import {expect, test} from 'vitest';
import {select} from './select';
import {createTranslator} from './translator';
import {createTranslatorFromDictionary} from './translator-from-dictionary';
const en = {
  youHaveMessages: select('count', {
    0: 'You have no messages',
    1: 'You have 1 message',
    other: 'You have {{count}} messages',
  }),
  helloNameYouHaveMessages: select('count', {
    0: 'Hello, {{name}}. You have no messages',
    1: 'Hello, {{name}}. You have 1 message',
    other: 'Hello, {{name}}. You have {{count}} messages',
  } as const),
  fruitPreference: select('fruit', {
    apple: 'I like apples',
    banana: 'I enjoy bananas',
    other: 'I prefer {{fruit}}',
  }),
} as const;

const translateEn = createTranslator(en);

test('Should translate correctly translator with plural', () => {
  expect(translateEn(l => l.youHaveMessages({count: 0}))).toBe('You have no messages');
  expect(translateEn(l => l.youHaveMessages({count: 1}))).toBe('You have 1 message');
  expect(translateEn(l => l.youHaveMessages({count: 2}))).toBe('You have 2 messages');

  expect(translateEn(l => l.helloNameYouHaveMessages({count: 0, name: 'Jo'}))).toBe('Hello, Jo. You have no messages');
  expect(translateEn(l => l.helloNameYouHaveMessages({count: 1, name: 'Jo'}))).toBe('Hello, Jo. You have 1 message');
  expect(translateEn(l => l.helloNameYouHaveMessages({count: 2, name: 'Jo'}))).toBe('Hello, Jo. You have 2 messages');
});

const translateEnFromDictionary = createTranslatorFromDictionary({
  dictionary: {en},
  locale: 'en',
  defaultLocale: 'en',
});

test('Should translate correctly translator from dictionary with plural', () => {
  expect(translateEnFromDictionary(l => l.youHaveMessages({count: 0}))).toBe('You have no messages');
  expect(translateEnFromDictionary(l => l.youHaveMessages({count: 1}))).toBe('You have 1 message');
  expect(translateEnFromDictionary(l => l.youHaveMessages({count: 2}))).toBe('You have 2 messages');

  expect(translateEnFromDictionary(l => l.helloNameYouHaveMessages({count: 0, name: 'Jo'}))).toBe(
    'Hello, Jo. You have no messages',
  );
  expect(translateEnFromDictionary(l => l.helloNameYouHaveMessages({count: 1, name: 'Jo'}))).toBe(
    'Hello, Jo. You have 1 message',
  );
  expect(translateEnFromDictionary(l => l.helloNameYouHaveMessages({count: 2, name: 'Jo'}))).toBe(
    'Hello, Jo. You have 2 messages',
  );

  expect(translateEnFromDictionary(l => l.fruitPreference({fruit: 'apple'}))).toBe('I like apples');
  expect(translateEnFromDictionary(l => l.fruitPreference({fruit: 'banana'}))).toBe('I enjoy bananas');
  expect(translateEnFromDictionary(l => l.fruitPreference({fruit: 'orange'}))).toBe('I prefer orange');
});
