# Active Context

## Next Action(s)

- Implement `AstBuilderVisitor` in `packages/javascript/src/AstBuilderVisitor.ts` to transform ANTLR Parse Tree into custom CST/AST.
- Define necessary JavaScript-specific AST/CST node types in `packages/javascript/src/types.ts`.
- Write more comprehensive tests (including snapshot tests) for the generated AST/CST structure in `packages/javascript/src/index.test.ts`.
- Investigate and fix/replace the cleaned `ECMAScript.g4` grammar to correctly handle ASI, Regex literals, etc.
- Restore accurate line/column tracking (fix simplified `Position` type and related logic).

## Waiting For

(None)
