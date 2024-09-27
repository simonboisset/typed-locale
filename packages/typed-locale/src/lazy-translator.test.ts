import {expect, test, vi} from 'vitest';
import {getDeep} from './deep';
import {InferTranslation} from './infer';
import {createLazyTranslator} from './lazy-translator';
import {plural} from './plural';

const en = {
  hello: 'Hello',
  helloName: 'Hello, {{name}}',
  goodbye: 'Goodbye',
  nested: {
    key: 'Nested key',
  },
  youHaveMessages: plural({
    0: 'You have no messages',
    1: 'You have 1 message',
    other: 'You have {{count}} messages',
  }),
} as const;

type Translations = InferTranslation<typeof en>;

const createMock = () =>
  vi.fn(async (path: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    const value = getDeep(en, path);
    if (value !== undefined) {
      return value;
    }

    return 'Translation not found';
  });

test('Should load and return translation', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  const result = await translator(t => t.hello);
  expect(result).toBe('Hello');
});

test('Should cache keys and avoid unnecessary loading', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  await translator(t => t.hello);
  expect(mockLazyLoadFn).toHaveBeenCalledTimes(1);

  const result = await translator(t => t.hello);
  expect(result).toBe('Hello');

  expect(mockLazyLoadFn).toHaveBeenCalledTimes(1);
});

test('Should handle nested keys', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  const result = await translator(t => t.nested.key);
  expect(result).toBe('Nested key');
});

test('Should handle variables', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  const result = await translator(t => t.helloName({name: 'John'}));
  expect(result).toBe('Hello, John');
});

test('Should use initial translations', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn, {hello: 'Initial Hello'});

  const result = await translator(t => t.hello);
  expect(result).toBe('Initial Hello');
  expect(mockLazyLoadFn).not.toHaveBeenCalled();
});

test('Should load missing keys', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn, {hello: 'Initial Hello'});

  const result = await translator(t => t.goodbye);
  expect(result).toBe('Goodbye');
  expect(mockLazyLoadFn).toHaveBeenCalledWith(['goodbye']);
});

test('Should handle plural translations', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  const noneResult = await translator(t => t.youHaveMessages({count: 0}));
  expect(noneResult).toBe('You have no messages');

  const oneResult = await translator(t => t.youHaveMessages({count: 1}));
  expect(oneResult).toBe('You have 1 message');

  const multipleResult = await translator(t => t.youHaveMessages({count: 5}));
  expect(multipleResult).toBe('You have 5 messages');
});

test('Should cache plural translations', async () => {
  const mockLazyLoadFn = createMock();
  const translator = createLazyTranslator<Translations>(mockLazyLoadFn);

  await translator(t => t.youHaveMessages({count: 0}));
  expect(mockLazyLoadFn).toHaveBeenCalledTimes(1);

  await translator(t => t.youHaveMessages({count: 1}));
  await translator(t => t.youHaveMessages({count: 5}));
  expect(mockLazyLoadFn).toHaveBeenCalledTimes(1);
});
