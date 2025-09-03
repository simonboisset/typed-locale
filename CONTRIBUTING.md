# Contributing to typed-locale

Thank you for your interest in contributing to typed-locale! This document outlines the process for contributing to this project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/simonboisset/typed-locale.git
   cd typed-locale
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Build the project**
   ```bash
   pnpm build
   ```

## Making Changes

### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write your code following the existing patterns
   - Add tests for new functionality
   - Ensure all tests pass: `pnpm test`
   - Ensure TypeScript checks pass: `pnpm ts`
   - Format your code: `pnpm format`

3. **Create a changeset**
   
   Before committing your changes, you need to create a changeset that describes what changed:
   
   ```bash
   pnpm changeset
   ```
   
   This will:
   - Prompt you to select which packages were affected
   - Ask for the type of change (patch, minor, major)
   - Request a description of the changes
   - Create a changeset file in `.changeset/`

   **Change Types:**
   - **patch**: Bug fixes and small improvements
   - **minor**: New features (backwards compatible)
   - **major**: Breaking changes

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Release Process

Our release process is fully automated:

1. **Changesets are created** by contributors when making changes
2. **Version bump PRs are automatically created** by the release workflow
3. **When merged, packages are automatically published** to npm and GitHub releases are created

### Manual Release (Maintainers Only)

If you need to release manually:

```bash
# 1. Version the packages
pnpm version

# 2. Install dependencies (updates lockfile with new versions)
pnpm install

# 3. Build and publish
pnpm release
```

## Code Style

- We use Prettier for code formatting
- Run `pnpm format` to format your code
- TypeScript strict mode is enabled
- Follow existing naming conventions

## Testing

- All new features should include tests
- Use Vitest for testing (`packages/typed-locale/src/**/*.test.ts`)
- Run tests with `pnpm test`
- Ensure 100% test coverage for new functionality

## Documentation

- Update documentation in the `apps/doc/` directory when adding new features
- Include JSDoc comments for public APIs
- Update README if necessary

## Questions?

If you have questions about contributing, please open an issue or start a discussion on GitHub.

Thank you for contributing! 🎉