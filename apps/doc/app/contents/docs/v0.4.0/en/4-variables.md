# Variables

One of the key features of `typed-locale` is its ability to handle variables in translations while maintaining type safety. This ensures that you're using the correct variables in your translations and helps prevent runtime errors.

## Using Variables in Translations

To use variables in your translations, you can include them in your translation strings using double curly braces `{{variableName}}`. Here's an example:

```typescript
export const en = {
  hello: 'Hello',
  helloName: 'Hello, {{name}}',
  userAge: '{{name}} is {{age}} years old',
} as const;
```

In this example, `helloName` and `userAge` include variables that will be replaced with actual values when the translation is used.
