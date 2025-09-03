# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `typed-locale`, a type-safe internationalization library for TypeScript. The project consists of:

- **Core library** (`packages/typed-locale/`): The main TypeScript library providing type-safe i18n functionality
- **Documentation site** (`apps/doc/`): A Remix-based documentation website with multi-language support

## Development Commands

### Root-level commands (use these for most operations):
- `pnpm install` - Install all dependencies
- `pnpm build` - Build all packages (uses Turbo for orchestration)
- `pnpm test` - Run all tests across packages
- `pnpm ts` - Type-check all packages
- `pnpm format` - Format all TypeScript/TSX/Markdown files using Prettier

### Package-specific commands:

#### Core library (`packages/typed-locale/`):
- `pnpm test` - Run Vitest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm build` - Build using tsup (outputs to `dist/`)
- `pnpm dev` - Build in watch mode
- `pnpm ts` - TypeScript type checking

#### Documentation site (`apps/doc/`):
- `pnpm dev` - Start Remix development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm ts` - TypeScript type checking

## Architecture

### Core Library Structure

The main library (`packages/typed-locale/src/`) follows a modular design:

- `index.ts` - Main entry point, exports public API
- `translator.ts` - Core translator functionality for single translations
- `translator-from-dictionary.ts` - Multi-language dictionary translator
- `lazy-translator.ts` - Async lazy-loading translator
- `plural.ts` - Pluralization support (uses `none`, `one`, `other` keys)
- `select.ts` - Conditional translation selection
- `translator-scope.ts` - Scoped/nested translation support
- `phrase-builder.ts` - Template variable substitution
- `infer.ts` - TypeScript type inference utilities
- `deep.ts` - Deep object manipulation utilities
- `extract-path.ts` - Translation key path extraction

### Key Design Principles

1. **Type Safety**: All translations are fully typed using TypeScript inference
2. **Pure Functions**: No global state mutation - translators are immutable
3. **Framework Agnostic**: Works with any JavaScript/TypeScript framework
4. **Variable Interpolation**: Uses `{{variable}}` syntax for dynamic content
5. **Pluralization**: Built-in plural support with `none`/`one`/`other` keys
6. **Lazy Loading**: Async translation loading for large applications

### Documentation Site Structure

The documentation site uses Remix with:
- **Multi-language routing**: `($lang)` prefix for all routes
- **Version-aware docs**: Multiple documentation versions under `contents/docs/v*`
- **Content structure**: Markdown files with TypeScript index files for metadata
- **i18n integration**: Uses the core typed-locale library for site translations

## Testing

- **Library tests**: Uses Vitest with `.test.ts` files alongside source files
- **Test coverage**: All core functionality has comprehensive test coverage
- **Test patterns**: Each module typically has a corresponding `.test.ts` file

## Build System

- **Monorepo**: Uses pnpm workspaces and Turbo for build orchestration
- **Library build**: tsup for ESM/CJS dual output with TypeScript declarations
- **Documentation build**: Standard Remix build process
- **Dependencies**: Build tasks are properly orchestrated (docs depends on library build)

## Package Management

- Uses `pnpm` as package manager (v9.5.0+)
- Workspace configuration in `pnpm-workspace.yaml`
- Turbo configuration in `turbo.json` for task orchestration

## Code Style

- **Prettier config**: Single quotes, 2-space tabs, 120 char width, no bracket spacing
- **TypeScript**: Strict mode enabled across all packages
- **File naming**: kebab-case for files, PascalCase for components