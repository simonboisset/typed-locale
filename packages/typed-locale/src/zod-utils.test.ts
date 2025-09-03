import {describe, expect, test} from 'vitest';
import {z} from 'zod';
import {createOptionsGenerator} from './options-generator';
import {createTranslator} from './translator';
import {createZodError, extractTranslationIssues, renderTranslationIssues, withTranslationMessage} from './zod-utils';

const en = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  passwordTooShort: 'Password must be at least {{min}} characters long',
  passwordTooLong: 'Password must be no more than {{max}} characters long',
  confirmPasswordMismatch: 'Passwords do not match',
  ageTooLow: 'You must be at least {{min}} years old',
  invalidUsername: 'Username must contain only letters, numbers, and underscores',
  nested: {
    validation: {
      stringTooShort: 'Must be at least {{min}} characters',
      numberTooLow: 'Must be at least {{min}}',
    },
  },
} as const;

const fr = {
  required: 'Ce champ est obligatoire',
  invalidEmail: 'Veuillez saisir une adresse e-mail valide',
  passwordTooShort: 'Le mot de passe doit contenir au moins {{min}} caractères',
  passwordTooLong: 'Le mot de passe ne doit pas dépasser {{max}} caractères',
  confirmPasswordMismatch: 'Les mots de passe ne correspondent pas',
  ageTooLow: 'Vous devez avoir au moins {{min}} ans',
  invalidUsername: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
  nested: {
    validation: {
      stringTooShort: 'Doit contenir au moins {{min}} caractères',
      numberTooLow: 'Doit être au moins {{min}}',
    },
  },
} as const;

const optionsEn = createOptionsGenerator(en);
const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);

describe('Zod Utils - Basic functionality', () => {
  test('Should create translation message that can be used with Zod', () => {
    const requiredOption = optionsEn(l => l.required);
    const translationMessage = withTranslationMessage(requiredOption);

    const schema = z.string().min(1, translationMessage);
    const result = schema.safeParse('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeDefined();
    }
  });

  test('Should extract translation issues from Zod error', () => {
    const requiredOption = optionsEn(l => l.required);
    const emailOption = optionsEn(l => l.invalidEmail);

    const schema = z.object({
      name: z.string().min(1, withTranslationMessage(requiredOption)),
      email: z.string().email(withTranslationMessage(emailOption)),
    });

    const result = schema.safeParse({name: '', email: 'invalid-email'});

    expect(result.success).toBe(false);
    if (!result.success) {
      const {translationIssues, regularIssues} = extractTranslationIssues(result.error);

      expect(translationIssues).toHaveLength(2);
      expect(regularIssues).toHaveLength(0);

      expect(translationIssues[0].path).toEqual(['name']);
      expect(translationIssues[1].path).toEqual(['email']);
    }
  });

  test('Should render translation issues with translator', () => {
    const requiredOption = optionsEn(l => l.required);
    const passwordOption = optionsEn(l => l.passwordTooShort({min: 8}));

    const schema = z.object({
      username: z.string().min(1, withTranslationMessage(requiredOption)),
      password: z.string().min(8, withTranslationMessage(passwordOption)),
    });

    const result = schema.safeParse({username: '', password: '123'});

    expect(result.success).toBe(false);
    if (!result.success) {
      const {translationIssues} = extractTranslationIssues(result.error);
      const renderedEn = renderTranslationIssues(translationIssues, translateEn);
      const renderedFr = renderTranslationIssues(translationIssues, translateFr);

      expect(renderedEn[0].message).toBe('This field is required');
      expect(renderedEn[1].message).toBe('Password must be at least 8 characters long');

      expect(renderedFr[0].message).toBe('Ce champ est obligatoire');
      expect(renderedFr[1].message).toBe('Le mot de passe doit contenir au moins 8 caractères');
    }
  });

  test('BEST PRACTICE: Single schema, multiple error renderers', () => {
    // 1. Define your schema ONCE (language-agnostic)
    const userRegistrationSchema = z.object({
      email: z
        .string()
        .min(1, withTranslationMessage(optionsEn(l => l.required)))
        .email(withTranslationMessage(optionsEn(l => l.invalidEmail))),
      password: z.string().min(8, withTranslationMessage(optionsEn(l => l.passwordTooShort({min: 8})))),
    });

    // 2. Create error renderers for each language you support
    const renderEnglishErrors = createZodError(translateEn);
    const renderFrenchErrors = createZodError(translateFr);

    // 3. Use the SAME schema everywhere
    const invalidData = {email: 'invalid-email', password: '123'};
    const validationResult = userRegistrationSchema.safeParse(invalidData);

    expect(validationResult.success).toBe(false);

    if (!validationResult.success) {
      // 4. Render errors in the language your user prefers
      const englishErrors = renderEnglishErrors(validationResult.error);
      const frenchErrors = renderFrenchErrors(validationResult.error);

      // Same validation, different languages
      expect(englishErrors).toHaveLength(2);
      expect(frenchErrors).toHaveLength(2);

      expect(englishErrors.find(e => e.path[0] === 'email')?.message).toBe('Please enter a valid email address');
      expect(frenchErrors.find(e => e.path[0] === 'email')?.message).toBe('Veuillez saisir une adresse e-mail valide');

      expect(englishErrors.find(e => e.path[0] === 'password')?.message).toBe(
        'Password must be at least 8 characters long',
      );
      expect(frenchErrors.find(e => e.path[0] === 'password')?.message).toBe(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }
  });
});

describe('Zod Utils - Real-world examples', () => {
  test('User registration form with mixed validation', () => {
    const createUserSchema = (options: typeof optionsEn) => {
      return z.object({
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
          .max(50, withTranslationMessage(options(l => l.passwordTooLong({max: 50})))),
        age: z.number().min(18, withTranslationMessage(options(l => l.ageTooLow({min: 18})))),
      });
    };

    const schema = createUserSchema(optionsEn);
    const errorRenderer = createZodError(translateFr);

    const result = schema.safeParse({
      username: 'invalid-user!',
      email: 'not-an-email',
      password: '123',
      age: 16,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = errorRenderer(result.error);

      expect(errors).toHaveLength(4);
      expect(errors.find(e => e.path[0] === 'username')?.message).toBe(
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
      );
      expect(errors.find(e => e.path[0] === 'email')?.message).toBe('Veuillez saisir une adresse e-mail valide');
      expect(errors.find(e => e.path[0] === 'password')?.message).toBe(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
      expect(errors.find(e => e.path[0] === 'age')?.message).toBe('Vous devez avoir au moins 18 ans');
    }
  });

  test('Nested validation with translation options', () => {
    const createNestedSchema = (options: typeof optionsEn) => {
      return z.object({
        profile: z.object({
          bio: z.string().min(10, withTranslationMessage(options(l => l.nested.validation.stringTooShort({min: 10})))),
          score: z.number().min(0, withTranslationMessage(options(l => l.nested.validation.numberTooLow({min: 0})))),
        }),
      });
    };

    const schema = createNestedSchema(optionsEn);
    const result = schema.safeParse({
      profile: {
        bio: 'short',
        score: -5,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const {translationIssues} = extractTranslationIssues(result.error);
      const renderedEn = renderTranslationIssues(translationIssues, translateEn);
      const renderedFr = renderTranslationIssues(translationIssues, translateFr);

      expect(renderedEn[0].path).toEqual(['profile', 'bio']);
      expect(renderedEn[0].message).toBe('Must be at least 10 characters');
      expect(renderedEn[1].path).toEqual(['profile', 'score']);
      expect(renderedEn[1].message).toBe('Must be at least 0');

      expect(renderedFr[0].message).toBe('Doit contenir au moins 10 caractères');
      expect(renderedFr[1].message).toBe('Doit être au moins 0');
    }
  });

  test('Mix of translated and regular Zod messages', () => {
    const schema = z.object({
      translatedField: z.string().min(1, withTranslationMessage(optionsEn(l => l.required))),
      regularField: z.string().min(5, 'This is a regular Zod message'),
    });

    const result = schema.safeParse({
      translatedField: '',
      regularField: '123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const {translationIssues, regularIssues} = extractTranslationIssues(result.error);

      expect(translationIssues).toHaveLength(1);
      expect(regularIssues).toHaveLength(1);

      expect(translationIssues[0].path).toEqual(['translatedField']);
      expect(regularIssues[0].path).toEqual(['regularField']);
      expect(regularIssues[0].message).toBe('This is a regular Zod message');

      const renderedTranslationEn = renderTranslationIssues(translationIssues, translateEn);
      expect(renderedTranslationEn[0].message).toBe('This field is required');
    }
  });

  test('Full error renderer with mixed messages', () => {
    const schema = z.object({
      name: z.string().min(1, withTranslationMessage(optionsEn(l => l.required))),
      description: z.string().min(10, 'Description must be at least 10 characters'),
    });

    const errorRenderer = createZodError(translateFr);
    const result = schema.safeParse({name: '', description: 'short'});

    expect(result.success).toBe(false);
    if (!result.success) {
      const allErrors = errorRenderer(result.error);

      expect(allErrors).toHaveLength(2);
      expect(allErrors.find(e => e.path[0] === 'name')?.message).toBe('Ce champ est obligatoire'); // Translated
      expect(allErrors.find(e => e.path[0] === 'description')?.message).toBe(
        'Description must be at least 10 characters',
      ); // Regular Zod message
    }
  });
});

describe('Zod Utils - Advanced use cases', () => {
  test('Single schema with multiple language renderers (RECOMMENDED PATTERN)', () => {
    // Define ONE schema that works for ALL languages
    const userSchema = z.object({
      email: z
        .string()
        .min(1, withTranslationMessage(optionsEn(l => l.required)))
        .email(withTranslationMessage(optionsEn(l => l.invalidEmail))),
      password: z.string().min(8, withTranslationMessage(optionsEn(l => l.passwordTooShort({min: 8})))),
    });

    // Create error renderers for different languages
    const enRenderer = createZodError(translateEn);
    const frRenderer = createZodError(translateFr);

    const invalidData = {email: 'invalid', password: '123'};

    // Use the SAME schema for validation
    const result = userSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      // Render the SAME validation errors in different languages
      const enErrors = enRenderer(result.error);
      const frErrors = frRenderer(result.error);

      expect(enErrors.find(e => e.path[0] === 'email')?.message).toBe('Please enter a valid email address');
      expect(frErrors.find(e => e.path[0] === 'email')?.message).toBe('Veuillez saisir une adresse e-mail valide');

      expect(enErrors.find(e => e.path[0] === 'password')?.message).toBe('Password must be at least 8 characters long');
      expect(frErrors.find(e => e.path[0] === 'password')?.message).toBe(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }
  });

  test('Real-world form validation pattern', () => {
    // Define your form schema once - language agnostic
    const createUserFormSchema = (options: typeof optionsEn) => {
      return z.object({
        username: z
          .string()
          .min(1, withTranslationMessage(options(l => l.required)))
          .regex(/^[a-zA-Z0-9_]+$/, withTranslationMessage(options(l => l.invalidUsername))),
        email: z
          .string()
          .min(1, withTranslationMessage(options(l => l.required)))
          .email(withTranslationMessage(options(l => l.invalidEmail))),
        password: z.string().min(8, withTranslationMessage(options(l => l.passwordTooShort({min: 8})))),
      });
    };

    // ONE schema definition
    const formSchema = createUserFormSchema(optionsEn);

    // Multiple error renderers
    const enErrorRenderer = createZodError(translateEn);
    const frErrorRenderer = createZodError(translateFr);

    const invalidData = {
      username: 'invalid-user!',
      email: 'not-an-email',
      password: '123',
    };

    // Validate once
    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      // Render in multiple languages
      const enErrors = enErrorRenderer(result.error);
      const frErrors = frErrorRenderer(result.error);

      // Both should have same structure, different messages
      expect(enErrors.length).toBe(frErrors.length);
      expect(enErrors.length).toBeGreaterThan(0);

      // Check English errors
      expect(
        enErrors.some(
          e => e.path[0] === 'username' && e.message === 'Username must contain only letters, numbers, and underscores',
        ),
      ).toBe(true);

      // Check French errors
      expect(
        frErrors.some(
          e =>
            e.path[0] === 'username' &&
            e.message === "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
        ),
      ).toBe(true);
    }
  });
});
