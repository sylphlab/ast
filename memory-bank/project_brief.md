# Project Brief: JavaScript AST Tool using ANTLR (Pure TS)

## Client Directive

Build an Abstract Syntax Tree (AST) tool using pure TypeScript.
Initial focus: Parsing **JavaScript**. (Changed from Markdown)
Architecture: Monorepo structure.
Mandate: Design for future extensibility to support all languages.

## Ordained Technology Stack

- Language: TypeScript
- Runtime: Node.js
- Package Manager: pnpm (workspaces)
- Monorepo Orchestration: Turborepo
- Parser Generator: **ANTLR v4** (`antlr4ts`, `antlr4ts-cli`)
- Testing: Vitest
- Build Tool: `tsup`
- Linting/Formatting: ESLint (`eslint-config-sylph`), Prettier (defaults)
- Versioning/Publishing: Changesets
- Git Hooks: Husky, lint-staged, commitlint

## Ordained Architecture

- **`@sylphlab/ast-core`**: Defines generic AST node interfaces/types.
- **`@sylphlab/ast-javascript`**: Implements **JavaScript** parsing using ANTLR-generated code (`antlr4ts`), mapping the ANTLR Parse Tree to `@sylphlab/ast-core` interfaces via a custom Visitor. Depends on `@sylphlab/ast-core` and `antlr4ts`.
  - **_PIVOT NOTE:_** _Pivoted from custom Parser Combinator engine to ANTLR due to persistent issues with combinator implementation and position tracking. Targeting JavaScript first._

## Initial Setup Progress (Completed)

1.  Initialized Git repository and pnpm workspace.
2.  Installed core development dependencies (TS, Turbo, ESLint, Prettier, Husky, etc.).
    - _Deviation Note:_ Used `eslint-config-love` and Prettier defaults due to publication errors in specified `@sylphlab` configurations.
3.  Configured ESLint, Prettier, Husky, commitlint, lint-staged.
4.  Added standard NPM scripts to root `package.json`.
5.  Created `packages/core` structure (`package.json`, `tsconfig.json`, `tsup.config.ts`, `src/index.ts` placeholder).
6.  Created `packages/javascript` (`@sylphlab/ast-javascript`) structure.
7.  Installed ANTLR dependencies (`antlr4ts`, `antlr4ts-cli`).
8.  Downloaded and cleaned ECMAScript `.g4` grammar file to `packages/javascript/grammar/`.
9.  Added `antlr` script to `packages/javascript/package.json` to generate TS parser code.
10. Configured ignores (`.gitignore`, `.prettierignore`) and `tsconfig.json` for generated code.
11. Generated initial ANTLR Lexer/Parser code.
12. Implemented basic ANTLR parsing flow in `packages/javascript/src/index.ts`.
13. Created basic `AstBuilderVisitor` structure.
14. Simplified core `Position` type (offset only) and related combinators/helpers (as part of debugging, marked as tech debt).
15. Configured build system (`tsup` + `tsc` initially, then reverted to `tsup --dts` based on user fix).
16. Configured `exports` field in `package.json` files.
17. Installed all dependencies via `pnpm install`.
18. Configured Turborepo (`turbo.json`).

## Next Objective

Implement the `AstBuilderVisitor` to transform the ANTLR Parse Tree into the custom CST/AST structure defined in `@sylphlab/ast-core` and `packages/javascript/src/types.ts`. Address known issues (grammar correctness, position tracking).
