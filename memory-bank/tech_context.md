# Technical Context: JavaScript AST Tool (ANTLR)

## Core Technology Stack

- **Language:** TypeScript (Strict mode enabled via `tsconfig.json`)
- **Runtime:** Node.js (Assumed environment for tooling and potential library usage)
- **Package Manager:** pnpm (v10.8.0) - Utilizing workspaces feature.
- **Monorepo Orchestration:** Turborepo - For managing tasks and build caching across packages.
- **Parser Generator:** ANTLR v4 (`antlr4ts`, `antlr4ts-cli`) - Used to generate TypeScript Lexer/Parser from `.g4` grammar file.
- **Build Tool:** `tsup` - Used for building individual packages (`@sylphlab/ast-core`, `@sylphlab/ast-javascript`) into CJS and ESM formats with type declarations (`--dts`). Configured via `tsup.config.ts` in each package. (Reverted from `tsup`+`tsc` strategy based on user fix).
- **Testing Framework:** Vitest - Chosen for testing package logic.
- **Versioning/Publishing:** Changesets - To be configured for managing package versions and publishing.

## Linting & Formatting

- **Linter:** ESLint
  - **Configuration:** `eslint-config-love` (Used as a deviation from `@sylphlab/eslint-config-sylph-strict` due to publication errors in the `@sylphlab` packages). Configured via root `eslint.config.js`.
- **Formatter:** Prettier
  - **Configuration:** Default Prettier settings (Used as a deviation from `@sylphlab/prettier-config` due to publication errors). Configured via root `.prettierrc.cjs`. Ignored files defined in `.prettierignore`.

## Git Hooks & Conventions

- **Hooks Manager:** Husky - Configured via `.husky/`.
- **Pre-commit Hook:** Runs `lint-staged`.
- **Commit Message Hook:** Runs `commitlint`.
- **Staged Files Tool:** `lint-staged` - Configured in root `package.json` to run ESLint and Prettier on staged files.
- **Commit Message Convention:** Conventional Commits - Enforced by `commitlint` using `@commitlint/config-conventional` preset via `commitlint.config.cjs`.

## Architecture

- **Monorepo Structure:** Packages located under the `packages/` directory.
- **Core Package (`@sylphlab/ast-core`):**
  - Location: `packages/core`
  - Purpose: Defines the generic, language-agnostic AST interfaces and base types (e.g., Node, Position). Intended to be the common target format for all parsers.
  - Build: Uses `tsup`.
- **JavaScript Parser Package (`@sylphlab/ast-javascript`):**
  - Location: `packages/javascript`
  - Purpose: Parses JavaScript input strings into the CST/AST format defined by `@sylphlab/ast-core` and its own types.
  - Implementation: Uses ANTLR-generated Lexer/Parser (`antlr4ts`) and a custom `AstBuilderVisitor` to transform the Parse Tree. Grammar file located in `packages/javascript/grammar/`. Generated code in `packages/javascript/src/generated/`.
  - Dependency: Depends on `@sylphlab/ast-core` and `antlr4ts`.
  - Build: Uses `tsup --dts`. Includes `antlr` script for code generation.

## TypeScript Configuration (`tsconfig.json`)

- Standard configuration applied to packages (`core`, `javascript`).
- Adheres to SylphLab standards for `tsup`-built packages:
  - `module: "preserve"` (tsup handles module transformation)
  - `noEmit` was removed during debugging, then build reverted to `tsup --dts`. Current `tsconfig` likely still has `noEmit` removed but it might not be necessary now.
  - `composite` and `references` were removed based on user fix, adhering to the "no composite" standard.
- Includes strict type checking options.
- Outputs declarations (`.d.ts`) and source maps via `tsup --dts`.
- `Position` type in `@sylphlab/ast-core` temporarily simplified to `{ offset: number }` as a workaround for persistent tracking issues (Technical Debt).

## ANTLR Integration

- **Grammar:** Using `ECMAScript.g4` from `antlr/grammars-v4`, manually cleaned to remove Java actions/predicates. Located in `packages/javascript/grammar/`.
  - _Known Issue:_ Cleaned grammar likely incorrect regarding ASI and Regex/Division distinction due to removed predicates.
- **Code Generation:** Uses `antlr4ts-cli` via `pnpm antlr` script in `ast-javascript` package. Generates TS Lexer, Parser, Listener, Visitor to `packages/javascript/src/generated/`.
- **Runtime:** Uses `antlr4ts` library.
- **AST Building:** A custom `AstBuilderVisitor` (`packages/javascript/src/AstBuilderVisitor.ts`) is used to traverse the ANTLR Parse Tree and construct the target CST/AST defined in `@sylphlab/ast-core` and `packages/javascript/src/types.ts`.
