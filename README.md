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

## Pluralization

You can use pluralization by using the `plural` function in your translation object.

```typescript
import {plural} from 'typed-locale';

export const en = {
  youHaveMessages: plural({
    none: 'You have no messages',
    one: 'You have 1 message',
    other: 'You have {{count}} messages',
  }),
} as const;

const translator = createTranslator(en);

const text = translator(t => t.youHaveMessages({count: 3}));
console.log(text); // 'You have 3 messages'
```

> Be careful that the pluralization uses the `count` name as a reserved variable name.

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

## Roadmap

Here is the roadmap for the library.

- [x] Type-safe declaration
- [x] Basic translation
- [x] Variable in translation
- [x] Strict type checking for variables
- [x] Default translation for missing key
- [x] Pluralization
- [x] Scoped translation with nested object
- [x] Improved type inference and auto-completion for variables
- [x] Support for lazy loading

Feel free to open an issue or pull request if you have any idea or suggestion.

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for detailed instructions.

### Quick Start for Contributors

1. **Fork and clone the repository**
2. **Install dependencies**: `pnpm install`
3. **Make your changes** and add tests
4. **Create a changeset**: `pnpm changeset`
5. **Submit a pull request**

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases:

- **Automated releases**: When changes are merged to `main`, packages are automatically published to npm
- **Changelog generation**: Changelogs are automatically generated from changeset descriptions  
- **Semantic versioning**: Version bumps follow semantic versioning based on changeset types

### For Contributors

When making changes, please create a changeset:

```bash
pnpm changeset
```

This helps us track changes and generate proper release notes.

Thank you for reading this README.md file. I hope you enjoy using this library.
