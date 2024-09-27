# Variables

L'une des fonctionnalités clés de `typed-locale` est sa capacité à gérer les variables dans les traductions tout en maintenant la sécurité des types. Cela garantit que vous utilisez les variables correctes dans vos traductions et aide à prévenir les erreurs d'exécution.

## Utilisation des variables dans les traductions

Pour utiliser des variables dans vos traductions, vous pouvez les inclure dans vos chaînes de traduction en utilisant des doubles accolades `{{nomDeVariable}}`. Voici un exemple :

```typescript
export const fr = {
  hello: 'Bonjour',
  helloName: 'Bonjour, {{name}}',
  userAge: '{{name}} a {{age}} ans',
} as const;
```

Dans cet exemple, `helloName` et `userAge` incluent des variables qui seront remplacées par des valeurs réelles lorsque la traduction sera utilisée.
