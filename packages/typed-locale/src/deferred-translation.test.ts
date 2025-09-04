import {describe, expect, test} from 'vitest';
import {createDeferredTranslator, createOptionDeferrer, isDeferredTranslation} from './deferred-translation';
import {createTranslator} from './translator';

const en = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  passwordTooShort: 'Password must be at least {{min}} characters long',
  ageTooLow: 'You must be at least {{min}} years old',
  nested: {
    validation: {
      stringTooShort: 'Must be at least {{min}} characters',
    },
  },
} as const;

const fr = {
  required: 'Ce champ est obligatoire',
  invalidEmail: 'Veuillez saisir une adresse e-mail valide',
  passwordTooShort: 'Le mot de passe doit contenir au moins {{min}} caractères',
  ageTooLow: 'Vous devez avoir au moins {{min}} ans',
  nested: {
    validation: {
      stringTooShort: 'Doit contenir au moins {{min}} caractères',
    },
  },
} as const;

const deferOptions = createOptionDeferrer<typeof en>();
const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);

const deferredTranslator = createDeferredTranslator(translateEn);
const deferredTranslatorFr = createDeferredTranslator(translateFr);

describe('Deferred Translation - End-to-end functionality', () => {
  test('Should translate simple messages correctly', () => {
    const requiredToken = deferOptions(l => l.required);
    const emailToken = deferOptions(l => l.invalidEmail);

    expect(isDeferredTranslation(requiredToken)).toBe(true);
    expect(isDeferredTranslation(emailToken)).toBe(true);

    expect(deferredTranslator(requiredToken)).toBe('This field is required');
    expect(deferredTranslator(emailToken)).toBe('Please enter a valid email address');

    expect(deferredTranslatorFr(requiredToken)).toBe('Ce champ est obligatoire');
    expect(deferredTranslatorFr(emailToken)).toBe('Veuillez saisir une adresse e-mail valide');
  });

  test('Should handle messages with variables correctly', () => {
    const passwordToken = deferOptions(l => l.passwordTooShort({min: 8}));
    const ageToken = deferOptions(l => l.ageTooLow({min: 18}));

    expect(isDeferredTranslation(passwordToken)).toBe(true);
    expect(isDeferredTranslation(ageToken)).toBe(true);

    expect(deferredTranslator(passwordToken)).toBe('Password must be at least 8 characters long');
    expect(deferredTranslatorFr(passwordToken)).toBe('Le mot de passe doit contenir au moins 8 caractères');

    expect(deferredTranslator(ageToken)).toBe('You must be at least 18 years old');
    expect(deferredTranslatorFr(ageToken)).toBe('Vous devez avoir au moins 18 ans');
  });

  test('Should work with nested translation keys', () => {
    const nestedToken = deferOptions(l => l.nested.validation.stringTooShort({min: 10}));

    expect(isDeferredTranslation(nestedToken)).toBe(true);

    expect(deferredTranslator(nestedToken)).toBe('Must be at least 10 characters');
    expect(deferredTranslatorFr(nestedToken)).toBe('Doit contenir au moins 10 caractères');
  });

  test('Should work with same token across multiple languages', () => {
    const token = deferOptions(l => l.passwordTooShort({min: 12}));

    expect(deferredTranslator(token)).toBe('Password must be at least 12 characters long');
    expect(deferredTranslatorFr(token)).toBe('Le mot de passe doit contenir au moins 12 caractères');

    expect(deferredTranslator(token)).not.toBe(deferredTranslatorFr(token));
  });

  test('Should handle token conversion workflow', () => {
    const token = deferOptions(l => l.required);

    expect(isDeferredTranslation(token)).toBe(true);
    expect(isDeferredTranslation('regular string')).toBe(false);

    expect(deferredTranslator(token)).toBe('This field is required');
    expect(deferredTranslatorFr(token)).toBe('Ce champ est obligatoire');
  });
});
