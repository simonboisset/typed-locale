# typed-locale

## 0.5.1

### Patch Changes

- refactor(zod-utils): remove global registry and counter, use stateless JSON-encoded tokens for translation options; improves purity and cross‑runtime safety without changing the public API

## 0.5.0

### Minor Changes

- Add options generator for language-agnostic translation keys

  Added support for generating Zod schema options from translation keys, enabling language-agnostic validation and type safety for internationalized applications.
