# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by `pnpm` workspaces + Turbo.
- `packages/typed-locale`: Core TypeScript library. Source in `src/*.ts`; tests in `src/*.test.ts`; build output in `dist/`.
- `apps/doc`: Remix + Vite documentation site. App code in `app/`, static assets in `public/`, build in `build/`.
- Shared config at repo root: `turbo.json`, `pnpm-workspace.yaml`, Prettier config in `package.json`.

## Build, Test, and Development Commands
- Install: `pnpm install`
- Build all: `pnpm build` (Turbo; builds library via `tsup`, docs app via Remix)
- Test all: `pnpm test` (Turbo; runs Vitest where defined)
- Type-check: `pnpm ts` (cascades `tsc` across packages)
- Format: `pnpm format`
- Package-specific examples:
  - Library dev build: `pnpm --filter typed-locale dev`
  - Library tests: `pnpm --filter typed-locale test`
  - Docs dev server: `pnpm --filter @typed-locale/doc dev`
  - Docs build/start: `pnpm --filter @typed-locale/doc build && pnpm --filter @typed-locale/doc start`

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Prefer pure, framework-agnostic functions in the library.
- Prettier: 2-space indent, single quotes, width 120, trailing commas, `arrowParens: avoid`, `bracketSpacing: false`.
- Files: kebab-case (e.g., `phrase-builder.ts`, `extract-path.test.ts`).
- Symbols: types/interfaces in PascalCase; functions/variables in camelCase; constants in UPPER_SNAKE_CASE when global.

## Testing Guidelines
- Framework: Vitest in the library.
- Location: co-located tests `src/*.test.ts` in `packages/typed-locale`.
- Expectations: add tests for new behavior; keep tests deterministic and side‑effect free; target high coverage for new code.
- Run: `pnpm test` or `pnpm --filter typed-locale test`.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat: add translator scope`, `fix: handle plural edge cases`).
- Changesets: run `pnpm changeset` and select affected package(s); choose patch/minor/major and write a clear summary.
- PRs: include a concise description, linked issues, test updates, and docs changes (`apps/doc`) with screenshots when UI changes affect docs.
- CI: PRs should build, type-check, and test cleanly.

## Security & Configuration Tips
- Node >= 20 for the docs app. Use `pnpm@9`.
- Do not commit `dist/`; builds are reproducible via `tsup` and Turbo.
- Public API: document with JSDoc and update docs when behavior changes.
