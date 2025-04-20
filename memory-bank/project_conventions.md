# Project Conventions

This document outlines the coding style, commit message format, and other conventions used in this project. Adherence is enforced where possible through tooling (ESLint, Prettier, commitlint, Husky).

## Commit Messages

- **Format:** Conventional Commits specification MUST be followed.
  - See: https://www.conventionalcommits.org/
- **Tooling:** Enforced by `commitlint` via Husky `commit-msg` hook using the `@commitlint/config-conventional` preset.
- **Example:** `feat(parser): add support for parsing blockquotes`
- **Types:** `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`.

## Branching Strategy

- **Main Branch:** `main` (or `master`) - Represents production-ready code. Direct pushes forbidden. Merges via Pull Requests only (after review/CI passes - _process TBD_).
- **Development Branch:** `develop` (Optional, can use `main` directly for simpler workflows initially) - Represents the latest development state.
- **Feature Branches:** `feature/<description>` (e.g., `feature/add-list-parsing`) - Branched from `develop` (or `main`). Merged back via Pull Request.
- **Fix Branches:** `fix/<description>` (e.g., `fix/heading-depth-error`) - Branched from `develop` (or `main`). Merged back via Pull Request.
- **Chore Branches:** `chore/<description>` (e.g., `chore/update-dependencies`) - For maintenance tasks. Merged back via Pull Request.

## Coding Style & Formatting

- **Linter:** ESLint using `eslint-config-love`.
  - Configuration: `eslint.config.js`
  - Enforcement: Run `pnpm lint` or `pnpm lint:fix`. Enforced pre-commit via Husky/lint-staged.
- **Formatter:** Prettier using default settings.
  - Configuration: `.prettierrc.cjs`, `.prettierignore`
  - Enforcement: Run `pnpm format`. Enforced pre-commit via Husky/lint-staged.
- **General:** Follow standard TypeScript best practices (strong typing, clarity, etc.).

## File Naming

- **TypeScript Files (.ts):** `kebab-case.ts` (e.g., `ast-interfaces.ts`, `markdown-parser.ts`)
- **Test Files (.test.ts):** `kebab-case.test.ts` or `PascalCase.test.ts` (co-located with source)
- **Configuration Files:** Use standard names (e.g., `tsconfig.json`, `tsup.config.ts`, `.prettierrc.cjs`).
- **Components (If applicable later):** `PascalCase.tsx` (or relevant extension)

## Type Safety

- **Strict Mode:** Enabled in `tsconfig.json`.
- **`any` Type:** Avoid using `any`. Use `unknown` or specific types.
- **Type Assertions:** Use sparingly. Prefer type guards or safer alternatives where possible.
