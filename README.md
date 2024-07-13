# typed-locale

Make multi languages application easy with type safety internationalization library.

## Installation

```bash
npm install typed-locale
yarn add typed-locale
pnpm add typed-locale
```

## Usage

### Create a translation object

First you need to create a translation object.

```javascript
export const en = {
  helloWordl: 'Hello, World!',
};
```

### Type the translation object

Define the type of the translation object.

```typescript
type Translation = typeof en;
```

### Create other translation objects

Create other translation objects with the same type.

```typescript
export const fr: Translation = {
  helloWordl: 'Bonjour, le monde!',
};
```

### Create a dictionary

Create a dictionary with the translation objects.

```typescript
const dictionary = { en, fr };
```

### Create a translator

Create a translator with the typed-locale.

```typescript
import { createTranslator } from 'typed-locale';

const translator = createTranslator({ dictionary, locale: 'en' });
```

### Translate a text

Translate a text with the translator.

```typescript
const text = translator((t) => t.helloWordl);
```

### Change the locale

Translator is pure function, so you need to create a new translator for changing the locale.

```typescript
const translatorFr = createTranslator({ dictionary, locale: 'fr' });
const textFr = translatorFr((t) => t.helloWordl);
```

## React example

Here is an example of using typed-locale with React by creating a custom hook.

```typescript
const useTranslator = (locale: string) => {
  const translator = createTranslator({ dictionary, locale });

  return translator;
};
```

In this way, you can use the translator in your components.

```typescript
const MyComponent = () => {
  const translator = useTranslator('en');
  const text = translator((t) => t.helloWordl);

  return <div>{text}</div>;
};
```
