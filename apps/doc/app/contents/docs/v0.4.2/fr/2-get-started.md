# Premiers pas

Ce guide vous accompagnera dans le processus de configuration et d'utilisation de typed-locale dans votre projet. Nous aborderons l'installation, la configuration de base et un exemple d'utilisation simple.

## Installation

Tout d'abord, vous devez installer typed-locale dans votre projet. Vous pouvez le faire en utilisant npm, yarn ou pnpm.

Avec npm :

```bash
npm install typed-locale
```

Avec yarn :

```bash
yarn add typed-locale
```

Avec pnpm :

```bash
pnpm add typed-locale
```

## Configuration de base

Une fois typed-locale installé, vous pouvez commencer à l'utiliser dans votre projet. Voici un guide étape par étape pour mettre en place un système de traduction basique :

### 1. Créer un objet de traduction

Tout d'abord, créez un fichier pour définir vos traductions. Par exemple, `translations.ts` :

```typescript
import {plural} from 'typed-locale';

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

### 2. Créer un traducteur

Ensuite, créez un traducteur en utilisant votre objet de traduction :

```typescript
import {createTranslator} from 'typed-locale';
import {en} from './translations';

const translator = createTranslator(en);
```

### 3. Utiliser le traducteur

Maintenant, vous pouvez utiliser le traducteur dans votre application :

```typescript
// Traduction simple
const greeting = translator(t => t.hello);
console.log(greeting); // Sortie : 'Hello'

// Traduction avec variables
const nameGreeting = translator(t => t.helloName({name: 'World'}));
console.log(nameGreeting); // Sortie : 'Hello, World'

// Pluralisation
const noMessages = translator(t => t.youHaveMessages({count: 0}));
console.log(noMessages); // Sortie : 'You have no messages'

const oneMessage = translator(t => t.youHaveMessages({count: 1}));
console.log(oneMessage); // Sortie : 'You have 1 message'

const manyMessages = translator(t => t.youHaveMessages({count: 5}));
console.log(manyMessages); // Sortie : 'You have 5 messages'
```

## Prochaines étapes

Cette configuration de base démontre les fonctionnalités principales de typed-locale. Dans les sections suivantes, nous explorerons des fonctionnalités plus avancées telles que :

- Travailler avec plusieurs langues
- Utiliser des dictionnaires pour le changement de langue
- Implémenter le chargement paresseux pour de grands ensembles de traductions
- Pluralisation avancée et utilisation de variables

En maîtrisant ces concepts, vous serez capable de créer des systèmes d'internationalisation robustes et typés pour vos projets TypeScript.
