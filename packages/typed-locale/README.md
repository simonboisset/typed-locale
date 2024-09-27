# typed-locale

Make multi-language applications easy with type-safe internationalization library.

## Introduction

`typed-locale` is a type-safe internationalization library for TypeScript.

The main reason for creating this library is to make it easy to create multi-language applications with type safety without any framework constraints.

Each translation experience I had was not satisfying because of the following reasons:

- Not type-safe
- Framework constraints
- Mutating global state

`typed-locale` is designed to be type-safe, framework-agnostic, and use pure functions.

## Installation

```bash
npm install typed-locale
yarn add typed-locale
pnpm add typed-locale
```

## Usage

### Create a translation object

First, you need to create a translation object.

```typescript
export const en = {
  hello: 'Hello',
  helloName: 'Hello, {{name}}',
  youHaveMessages: plural({
    none: 'You have no messages',
    one: 'You have 1 message',
    other: 'You have {{count}} messages',
  }),
} as const;
```

### Type the translation object

Define the type of the translation object.

```typescript
import {InferTranslation} from 'typed-locale';

type Translation = InferTranslation<typeof en>;
```

### Create other translation objects

Create other translation objects with the same type.

```typescript
export const fr: Translation = {
  hello: 'Bonjour',
  helloName: 'Bonjour, {{name}}',
  youHaveMessages: plural({
    none: 'Vous n'avez aucun message',
    one: 'Vous avez 1 message',
    other: 'Vous avez {{count}} messages',
  }),
};
```

### Create a dictionary

Create a dictionary with the translation objects.

```typescript
const dictionary = {en, fr};
```

### Create a translator

Create a translator with typed-locale.

```typescript
import {createTranslatorFromDictionary} from 'typed-locale';

const translator = createTranslatorFromDictionary({dictionary, locale: 'en', defaultLocale: 'en'});
```

You can create a simple translator with only one translation object.

```typescript
import {createTranslator} from 'typed-locale';

const translator = createTranslator(en);
```

> Be careful that the translator created with `createTranslator` does not support default translation for missing keys.

### Translate a text

Translate a text with the translator.

```typescript
const text = translator(t => t.hello);
const textWithName = translator(t => t.helloName({name: 'World'}));
const textWithPlural = translator(t => t.youHaveMessages({count: 2}));
```

### Change the locale

Translator is a pure function, so you need to create a new translator for changing the locale.

```typescript
const translatorFr = createTranslatorFromDictionary({dictionary, locale: 'fr', defaultLocale: 'en'});
const textFr = translatorFr(t => t.hello);
```

## React example

Here's an example of using typed-locale with React by creating a custom hook.

```typescript
const useTranslator = (locale: string) => {
  const translator = createTranslatorFromDictionary({dictionary, locale, defaultLocale: 'en'});
  return translator;
};
```

In this way, you can use the translator in your components.

```typescript
const MyComponent = () => {
  const translator = useTranslator('en');
  const text = translator((t) => t.helloName({ name: 'World' }));

  return <div>{text}</div>;
};
```

## Use variable in translation

You can use variable in translation by using the `{{variable}}` syntax.

```typescript
export const en = {
  helloName: 'Hello, {{name}}',
} as const;
```

```typescript
const translator = createTranslator(en);

const text = translator(t => t.helloName({name: 'World'}));
console.log(text); // 'Hello, World!'
```

## Default translation

If you have some translations that are not ready for all languages, you can use InferPartialTranslation type to define the other translations.

```typescript
export const en = {
  hello: 'Hello, {{name}}!',
  anotherKey: 'Another',
} as const;

type Translation = InferTranslation<typeof en>;

const fr: InferPartialTranslation<Translation> = {
  hello: 'Bonjour, {{name}}!',
};

const dictionary = {en, fr};

const translator = createTranslatorFromDictionary({dictionary, locale: 'fr', defaultLocale: 'en'});

console.log(translator(t => t.anotherKey)); // 'Another'
```

## Select

The `select` function is a tool for handling pluralization and conditional text selection in translations. It allows you to define different text variants based on a specific variable's value.

### Basic Syntax

```typescript
select(key, options);
```

- `key`: The variable name to base the selection on (e.g., 'count', 'fruit')
- `options`: An object containing the different text variants

### Examples

#### Pluralization

```typescript
const messages = {
  youHaveMessages: select('count', {
    0: 'You have no messages',
    1: 'You have 1 message',
    other: 'You have {{count}} messages',
  } as const),
};
```

> Don't forget to use `as const` for the options object.
> `other` is a required key for the default translation.
> In this example, the text changes based on the `count` value:

- If `count` is 0, it returns "You have no messages"
- If `count` is 1, it returns "You have 1 message"
- For any other value, it returns "You have {{count}} messages", where `{{count}}` will be replaced with the actual number

#### Combining with Other Variables

```typescript
const greetings = {
  helloNameYouHaveMessages: select('count', {
    0: 'Hello, {{name}}. You have no messages',
    1: 'Hello, {{name}}. You have 1 message',
    other: 'Hello, {{name}}. You have {{count}} messages',
  } as const),
};
```

This example combines the `count` selection with another variable `{{name}}`, allowing for more complex translations.

#### Non-numeric Selection

```typescript
const preferences = {
  fruitPreference: select('fruit', {
    apple: 'I like apples',
    banana: 'I enjoy bananas',
    other: 'I prefer {{fruit}}',
  }),
};
```

The `select` function can also be used with non-numeric keys. In this case, it selects based on the `fruit` value:

- If `fruit` is "apple", it returns "I like apples"
- If `fruit` is "banana", it returns "I enjoy bananas"
- For any other fruit, it returns "I prefer {{fruit}}", where `{{fruit}}` will be replaced with the actual fruit name

### Usage with Translators

When used with a translator function, you can easily generate the appropriate text:

```typescript
const translateEn = createTranslator(messages);

translateEn(l => l.youHaveMessages({count: 0})); // "You have no messages"
translateEn(l => l.youHaveMessages({count: 1})); // "You have 1 message"
translateEn(l => l.youHaveMessages({count: 2})); // "You have 2 messages"

translateEn(l => l.helloNameYouHaveMessages({count: 1, name: 'Jo'})); // "Hello, Jo. You have 1 message"

translateEn(l => l.fruitPreference({fruit: 'apple'})); // "I like apples"
translateEn(l => l.fruitPreference({fruit: 'orange'})); // "I prefer orange"
```

The `select` function provides a flexible way to handle various translation scenarios, from simple pluralization to more complex conditional text selection.

## Scoped translation

You can use scoped translation by using the `getTranslatorScope` function.

```typescript
import {getTranslatorScope} from 'typed-locale';

export const en = {
  hello: 'Hello, {{name}}!',
  nested: {
    hello: 'Nested Hello, {{name}}!',
  },
} as const;

const translator = createTranslator(en);
const nestedTranslator = getTranslatorScope(translator, t => t.nested);

const text = nestedTranslator(t => t.hello({name: 'World'}));
console.log(text); // 'Nested Hello, World!'
```

## Lazy Loading

`typed-locale` supports lazy loading of translations, which can be useful for large applications or when you want to load translations on-demand.

### Create a lazy translator

To use lazy loading, you need to create a lazy translator using the `createLazyTranslator` function.

```typescript
import {createLazyTranslator, LazyLoadFunction} from 'typed-locale';

const lazyLoadFn: LazyLoadFunction = async (paths: string[]) => {
  // Implement your lazy loading logic here
  const translation = await fetchTranslation(paths);
  return translation;
};

const initialTranslations = {
  // Optional
  // Add any initial translations you want to have available immediately
};

const lazyTranslator = createLazyTranslator(lazyLoadFn, initialTranslations);
```

### Use the lazy translator

You can use the lazy translator similarly to the regular translator, but it returns a Promise that resolves to the translated string.

```typescript
const translatedText = await lazyTranslator(t => t.hello);
console.log(translatedText); // 'Hello'

const translatedTextWithName = await lazyTranslator(t => t.helloName({name: 'World'}));
console.log(translatedTextWithName); // 'Hello, World'
```

### Caching

The lazy translator automatically caches loaded translations, so subsequent requests for the same key will not trigger additional lazy loading.

## Contribution guide

This library is still in the early stage, so any contribution is welcome.
Here are some ways to contribute to this library.

In general, the contribution process is as follows:

1. Fork this repository and make changes
2. Create a pull request
3. Wait for the review
4. I will review the pull request
5. If everything is fine, I will merge the pull request and release a new version

### Setup the project locally

After forking this repository, you can set up the project locally by following the steps below.

```bash
pnpm install
```

As you can see, this project uses `pnpm` as a package manager. If you don't have `pnpm` installed, you can install it by running the following command.

```bash
npm install -g pnpm
```

### Run the test

You can run the test by running the following command.

```bash
pnpm test
```

### Write your update

After setting up the project locally, you can make changes to the code.

> For every change, you need to write tests to make sure that the changes work as expected.
> I will be attentive to the test coverage, so please write tests for every change.

Then you can commit your changes and create a pull request.

Thank you for reading this README.md file. I hope you enjoy using this library.
