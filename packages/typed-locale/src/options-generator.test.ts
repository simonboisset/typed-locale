import {expect, test} from 'vitest';
import {createTranslator} from './translator';
import {createOptionsGenerator} from './options-generator';

const en = {
  fieldIsRequired: 'Field is required',
  fieldMustBeEmail: 'Field must be a valid email',
  fieldTooShort: 'Field must be at least {{min}} characters',
  fieldTooLong: 'Field must be at most {{max}} characters',
  nested: {
    validation: {
      required: 'This field is required',
      invalidFormat: 'Invalid format for {{field}}',
    },
  },
} as const;

const fr = {
  fieldIsRequired: 'Le champ est requis',
  fieldMustBeEmail: 'Le champ doit être un email valide',
  fieldTooShort: 'Le champ doit contenir au moins {{min}} caractères',
  fieldTooLong: 'Le champ doit contenir au maximum {{max}} caractères',
  nested: {
    validation: {
      required: 'Ce champ est requis',
      invalidFormat: 'Format invalide pour {{field}}',
    },
  },
} as const;

const optionsEn = createOptionsGenerator(en);
const optionsFr = createOptionsGenerator(fr);
const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);

test('Should create options that work with different language translators', () => {
  const requiredOption = optionsEn(l => l.fieldIsRequired);
  const emailOption = optionsEn(l => l.fieldMustBeEmail);
  
  expect(translateEn(requiredOption)).toBe('Field is required');
  expect(translateFr(requiredOption)).toBe('Le champ est requis');
  
  expect(translateEn(emailOption)).toBe('Field must be a valid email');
  expect(translateFr(emailOption)).toBe('Le champ doit être un email valide');
});

test('Should work with options that have variables', () => {
  const tooShortOption = optionsEn(l => l.fieldTooShort({min: 5}));
  const tooLongOption = optionsEn(l => l.fieldTooLong({max: 100}));
  
  expect(translateEn(tooShortOption)).toBe('Field must be at least 5 characters');
  expect(translateFr(tooShortOption)).toBe('Le champ doit contenir au moins 5 caractères');
  
  expect(translateEn(tooLongOption)).toBe('Field must be at most 100 characters');
  expect(translateFr(tooLongOption)).toBe('Le champ doit contenir au maximum 100 caractères');
});

test('Should work with nested translation keys', () => {
  const nestedRequiredOption = optionsEn(l => l.nested.validation.required);
  const nestedInvalidOption = optionsEn(l => l.nested.validation.invalidFormat({field: 'username'}));
  
  expect(translateEn(nestedRequiredOption)).toBe('This field is required');
  expect(translateFr(nestedRequiredOption)).toBe('Ce champ est requis');
  
  expect(translateEn(nestedInvalidOption)).toBe('Invalid format for username');
  expect(translateFr(nestedInvalidOption)).toBe('Format invalide pour username');
});

test('Should work with French options generator on English translator', () => {
  const requiredOptionFr = optionsFr(l => l.fieldIsRequired);
  const emailOptionFr = optionsFr(l => l.fieldMustBeEmail);
  
  expect(translateEn(requiredOptionFr)).toBe('Field is required');
  expect(translateEn(emailOptionFr)).toBe('Field must be a valid email');
});

test('Should demonstrate Zod-like usage pattern', () => {
  // Simulate defining validation schema with options (like Zod)
  const createValidationSchema = <T extends Record<string, unknown>>(options: typeof optionsEn) => {
    return {
      email: {
        required: options(l => l.fieldIsRequired),
        invalidEmail: options(l => l.fieldMustBeEmail),
      },
      password: {
        required: options(l => l.fieldIsRequired),
        tooShort: options(l => l.fieldTooShort({min: 8})),
      },
    };
  };
  
  const validationSchema = createValidationSchema(optionsEn);
  
  // Later in the app with different languages
  const enErrors = {
    emailRequired: translateEn(validationSchema.email.required),
    emailInvalid: translateEn(validationSchema.email.invalidEmail),
    passwordRequired: translateEn(validationSchema.password.required),
    passwordTooShort: translateEn(validationSchema.password.tooShort),
  };
  
  const frErrors = {
    emailRequired: translateFr(validationSchema.email.required),
    emailInvalid: translateFr(validationSchema.email.invalidEmail), 
    passwordRequired: translateFr(validationSchema.password.required),
    passwordTooShort: translateFr(validationSchema.password.tooShort),
  };
  
  expect(enErrors.emailRequired).toBe('Field is required');
  expect(enErrors.emailInvalid).toBe('Field must be a valid email');
  expect(enErrors.passwordTooShort).toBe('Field must be at least 8 characters');
  
  expect(frErrors.emailRequired).toBe('Le champ est requis');
  expect(frErrors.emailInvalid).toBe('Le champ doit être un email valide');
  expect(frErrors.passwordTooShort).toBe('Le champ doit contenir au moins 8 caractères');
});