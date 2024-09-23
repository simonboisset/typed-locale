import {plural} from 'typed-locale';
import {Translations} from './en';

export const fr: Translations = {
  landingPage: {
    title: 'Bienvenue sur typed-locale',
    subtitle:
      "Facilitez le développement d'applications multi-langues avec une bibliothèque d'internationalisation type-safe.",
    getStarted: 'Commencer',
    viewOnGithub: 'Voir sur GitHub',
    features: {
      typeSafe: {
        title: 'Type-Safe',
        description: 'Conçu pour être entièrement type-safe, assurant une internationalisation robuste.',
      },
      frameworkAgnostic: {
        title: 'Framework-Agnostic',
        description: "Utilisable avec n'importe quel framework ou projet JavaScript/TypeScript vanilla.",
      },
      pureFunctions: {
        title: 'Pure Functions',
        description: "Utilise des pure functions sans modifier l'état global.",
      },
    },
    screenshotSection: {
      title: 'Internationalisation Type-Safe',
      description:
        "typed-locale offre une approche type-safe pour l'internationalisation. Profitez d'une auto-complétion robuste et détectez les erreurs lorsque les variables changent dans vos locales.",
      getStarted: 'Commencer',
    },
    footer: {
      copyright: '© 2024 Simon Boisset. Tous droits réservés.',
      github: 'Github',
      simonBoisset: 'Simon Boisset',
    },
  },
  article: {
    estimatedReadingTime: plural({
      none: 'Temps de lecture estimé: 0 minute',
      one: 'Temps de lecture estimé: 1 minute',
      other: 'Temps de lecture estimé: {{count}} minutes',
    }),
    previous: 'Précédent',
    next: 'Suivant',
  },
  sidebar: {
    documentation: 'Documentation',
    toggleDocumentationMenu: 'Basculer le menu de documentation',
  },
  header: {
    docs: 'Docs',
    blog: 'Blog',
  },
};
