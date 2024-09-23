import {InferTranslation, plural} from 'typed-locale';

export const en = {
  landingPage: {
    title: 'Welcome to typed-locale',
    subtitle: 'Make multi-language applications development easy with type-safe internationalization library.',
    getStarted: 'Get Started',
    viewOnGithub: 'View on GitHub',
    features: {
      typeSafe: {
        title: 'Type-Safe',
        description: 'Designed to be fully type-safe, ensuring robust internationalization.',
      },
      frameworkAgnostic: {
        title: 'Framework-Agnostic',
        description: 'Use with any framework or vanilla JavaScript/TypeScript projects.',
      },
      pureFunctions: {
        title: 'Pure Functions',
        description: 'Utilizes pure functions without mutating global state.',
      },
    },
    screenshotSection: {
      title: 'Type-Safe Internationalization',
      description:
        'typed-locale provides a type-safe approach to internationalization. Experience robust auto-completion and catch errors when variables change in your locales.',
      getStarted: 'Get Started',
    },
    footer: {
      copyright: '© 2024 Simon Boisset. All rights reserved.',
      github: 'Github',
      simonBoisset: 'Simon Boisset',
    },
  },
  article: {
    estimatedReadingTime: plural({
      none: 'Estimated reading time: 0 minute',
      one: 'Estimated reading time: 1 minute',
      other: 'Estimated reading time: {{count}} minutes',
    }),
    previous: 'Previous',
    next: 'Next',
  },
  sidebar: {
    documentation: 'Documentation',
    toggleDocumentationMenu: 'Toggle documentation menu',
  },
  header: {
    docs: 'Docs',
    blog: 'Blog',
  },
} as const;

export type Translations = InferTranslation<typeof en>;
