import {expect, test} from 'vitest';
import {plural} from './plural';
import {createTranslator} from './translator';
import {createTranslatorFromDictionary} from './translator-from-dictionary';
const en = {
  youHaveMessages: plural({
    0: 'You have no messages',
    1: 'You have 1 message',
    other: 'You have {{count}} messages',
  } as const),
  helloNameYouHaveMessages: plural({
    0: 'Hello, {{name}}. You have no messages',
    1: 'Hello, {{name}}. You have 1 message',
    other: 'Hello, {{name}}. You have {{count}} messages',
  } as const),
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
});
