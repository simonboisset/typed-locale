/**
 * RECOMMENDED PATTERN: One Schema, Multiple Error Renderers
 *
 * This example demonstrates the correct way to use typed-locale with Zod:
 * 1. Define your schema ONCE using translation options
 * 2. Create error renderers for each language you support
 * 3. Use the same schema for validation, different renderers for errors
 */

import {z} from 'zod';
import {createOptionsGenerator, createTranslator, createZodError, withTranslationMessage} from './index';

// Define your translations for each language
const en = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  passwordTooShort: 'Password must be at least {{min}} characters long',
  passwordTooLong: 'Password must be no more than {{max}} characters long',
  ageTooLow: 'You must be at least {{min}} years old',
  invalidUsername: 'Username must contain only letters, numbers, and underscores',
} as const;

const fr = {
  required: 'Ce champ est obligatoire',
  invalidEmail: 'Veuillez saisir une adresse e-mail valide',
  passwordTooShort: 'Le mot de passe doit contenir au moins {{min}} caractères',
  passwordTooLong: 'Le mot de passe ne doit pas dépasser {{max}} caractères',
  ageTooLow: 'Vous devez avoir au moins {{min}} ans',
  invalidUsername: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
} as const;

const es = {
  required: 'Este campo es obligatorio',
  invalidEmail: 'Por favor ingrese una dirección de correo válida',
  passwordTooShort: 'La contraseña debe tener al menos {{min}} caracteres',
  passwordTooLong: 'La contraseña no debe tener más de {{max}} caracteres',
  ageTooLow: 'Debes tener al menos {{min}} años',
  invalidUsername: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
} as const;

// Create options generator and translators
const options = createOptionsGenerator(en);
const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);
const translateEs = createTranslator(es);

// STEP 1: Define your schema ONCE - language agnostic
export const userRegistrationSchema = z.object({
  username: z
    .string()
    .min(1, withTranslationMessage(options(l => l.required)))
    .regex(/^[a-zA-Z0-9_]+$/, withTranslationMessage(options(l => l.invalidUsername))),

  email: z
    .string()
    .min(1, withTranslationMessage(options(l => l.required)))
    .email(withTranslationMessage(options(l => l.invalidEmail))),

  password: z
    .string()
    .min(8, withTranslationMessage(options(l => l.passwordTooShort({min: 8}))))
    .max(100, withTranslationMessage(options(l => l.passwordTooLong({max: 100})))),

  age: z.number().min(18, withTranslationMessage(options(l => l.ageTooLow({min: 18})))),
});

// STEP 2: Create error renderers for each language
export const errorRenderers = {
  en: createZodError(translateEn),
  fr: createZodError(translateFr),
  es: createZodError(translateEs),
} as const;

// STEP 3: Usage example - validate once, render in any language
export const validateUserRegistration = (userData: unknown, language: keyof typeof errorRenderers = 'en') => {
  const result = userRegistrationSchema.safeParse(userData);

  if (!result.success) {
    const errors = errorRenderers[language](result.error);
    return {
      success: false,
      errors: errors.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

// Example usage in different contexts:

// In your React component:
// const { errors } = validateUserRegistration(formData, userLanguage);

// In your API endpoint:
// const validation = validateUserRegistration(req.body, getRequestLanguage(req));
// if (!validation.success) {
//   return res.status(400).json({ errors: validation.errors });
// }

// In your tests:
// expect(validateUserRegistration({}, 'en').errors[0].message).toBe('This field is required');
// expect(validateUserRegistration({}, 'fr').errors[0].message).toBe('Ce champ est obligatoire');
