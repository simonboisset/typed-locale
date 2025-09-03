import {describe, expect, test} from 'vitest';
import {z} from 'zod';
import {createTranslator} from './translator';
import {createZodOptions, createZodTranslator} from './zod-utils';

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

const optionsEn = createZodOptions(en);
const translateEn = createTranslator(en);
const translateFr = createTranslator(fr);

describe('Zod Utils - Basic functionality', () => {
  test('Should create translation message that can be used with Zod', () => {
    const translationMessage = optionsEn(l => l.required);

    const schema = z.string().min(1, translationMessage);
    const result = schema.safeParse('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeDefined();
    }
  });

  test('Should extract translation issues from Zod error', () => {
    const schema = z.object({
      name: z.string().min(
        1,
        optionsEn(l => l.required),
      ),
      email: z.string().email(optionsEn(l => l.invalidEmail)),
    });

    const result = schema.safeParse({name: '', email: 'invalid-email'});

    expect(result.success).toBe(false);
    if (!result.success) {
      const translator = createZodTranslator(translateEn);
      const issues = translator(result.error);

      expect(issues[0].path).toEqual(['name']);
      expect(issues[1].path).toEqual(['email']);
    }
  });

  test('Should render translation issues with translator', () => {
    const schema = z.object({
      username: z.string().min(
        1,
        optionsEn(l => l.required),
      ),
      password: z.string().min(
        8,
        optionsEn(l => l.passwordTooShort({min: 8})),
      ),
    });

    const result = schema.safeParse({username: '', password: '123'});

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuesEn = createZodTranslator(translateEn)(result.error);
      const issuesFr = createZodTranslator(translateFr)(result.error);

      expect(issuesEn[0].message).toBe('This field is required');
      expect(issuesEn[1].message).toBe('Password must be at least 8 characters long');

      expect(issuesFr[0].message).toBe('Ce champ est obligatoire');
      expect(issuesFr[1].message).toBe('Le mot de passe doit contenir au moins 8 caractères');
    }
  });

  test('BEST PRACTICE: Single schema, multiple error renderers', () => {
    // 1. Define your schema ONCE (language-agnostic)
    const userRegistrationSchema = z.object({
      email: z
        .string()
        .min(
          1,
          optionsEn(l => l.required),
        )
        .email(optionsEn(l => l.invalidEmail)),
      password: z.string().min(
        8,
        optionsEn(l => l.passwordTooShort({min: 8})),
      ),
    });

    // 2. Create error renderers for each language you support
    const renderEnglishErrors = createZodTranslator(translateEn);
    const renderFrenchErrors = createZodTranslator(translateFr);

    // 3. Use the SAME schema everywhere
    const invalidData = {email: 'invalid-email', password: '123'};
    const validationResult = userRegistrationSchema.safeParse(invalidData);

    expect(validationResult.success).toBe(false);

    if (!validationResult.success) {
      // 4. Render errors in the language your user prefers
      const englishErrors = renderEnglishErrors(validationResult.error);
      const frenchErrors = renderFrenchErrors(validationResult.error);

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
          .min(
            1,
            options(l => l.required),
          )
          .regex(
            /^[a-zA-Z0-9_]+$/,
            options(l => l.invalidUsername),
          ),
        email: z
          .string()
          .min(
            1,
            options(l => l.required),
          )
          .email(options(l => l.invalidEmail)),
        password: z
          .string()
          .min(
            8,
            options(l => l.passwordTooShort({min: 8})),
          )
          .max(
            50,
            options(l => l.passwordTooLong({max: 50})),
          ),
        age: z.number().min(
          18,
          options(l => l.ageTooLow({min: 18})),
        ),
      });
    };

    const schema = createUserSchema(optionsEn);
    const errorRenderer = createZodTranslator(translateFr);

    const result = schema.safeParse({
      username: 'invalid-user!',
      email: 'not-an-email',
      password: '123',
      age: 16,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = errorRenderer(result.error);

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
          bio: z.string().min(
            10,
            optionsEn(l => l.nested.validation.stringTooShort({min: 10})),
          ),
          score: z.number().min(
            0,
            optionsEn(l => l.nested.validation.numberTooLow({min: 0})),
          ),
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
      const issuesEn = createZodTranslator(translateEn)(result.error);
      const issuesFr = createZodTranslator(translateFr)(result.error);

      expect(issuesEn[0].path).toEqual(['profile', 'bio']);
      expect(issuesEn[0].message).toBe('Must be at least 10 characters');
      expect(issuesEn[1].path).toEqual(['profile', 'score']);
      expect(issuesEn[1].message).toBe('Must be at least 0');

      expect(issuesFr[0].message).toBe('Doit contenir au moins 10 caractères');
      expect(issuesFr[1].message).toBe('Doit être au moins 0');
    }
  });

  test('Mix of translated and regular Zod messages', () => {
    const schema = z.object({
      translatedField: z.string().min(
        1,
        optionsEn(l => l.required),
      ),
      regularField: z.string().min(5, 'This is a regular Zod message'),
    });

    const result = schema.safeParse({
      translatedField: '',
      regularField: '123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuesEn = createZodTranslator(translateEn)(result.error);
      const issuesFr = createZodTranslator(translateFr)(result.error);

      expect(issuesEn[0].path).toEqual(['translatedField']);
      expect(issuesEn[1].path).toEqual(['regularField']);
      expect(issuesEn[1].message).toBe('This is a regular Zod message');

      expect(issuesFr[0].message).toBe('Ce champ est obligatoire');
      expect(issuesFr[1].message).toBe('This is a regular Zod message');
    }
  });

  test('Full error renderer with mixed messages', () => {
    const schema = z.object({
      name: z.string().min(
        1,
        optionsEn(l => l.required),
      ),
      description: z.string().min(10, 'Description must be at least 10 characters'),
    });

    const errorRenderer = createZodTranslator(translateFr);
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
        .min(
          1,
          optionsEn(l => l.required),
        )
        .email(optionsEn(l => l.invalidEmail)),
      password: z.string().min(
        8,
        optionsEn(l => l.passwordTooShort({min: 8})),
      ),
    });

    // Create error renderers for different languages
    const enRenderer = createZodTranslator(translateEn);
    const frRenderer = createZodTranslator(translateFr);

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
          .min(
            1,
            options(l => l.required),
          )
          .regex(
            /^[a-zA-Z0-9_]+$/,
            options(l => l.invalidUsername),
          ),
        email: z
          .string()
          .min(
            1,
            options(l => l.required),
          )
          .email(options(l => l.invalidEmail)),
        password: z.string().min(
          8,
          options(l => l.passwordTooShort({min: 8})),
        ),
      });
    };

    // ONE schema definition
    const formSchema = createUserFormSchema(optionsEn);

    // Multiple error renderers
    const enErrorRenderer = createZodTranslator(translateEn);
    const frErrorRenderer = createZodTranslator(translateFr);

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
