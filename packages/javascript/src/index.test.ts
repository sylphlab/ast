// packages/javascript/src/index.test.ts
import { describe, it, expect } from 'vitest';
import { parseJavaScript } from './index';
// No longer importing ANTLR context type directly for assertion

describe('ANTLR JavaScript Parser Integration', () => {
  it('should parse simple valid input without errors', () => {
    const code = 'const a = 1;';
    const result = parseJavaScript(code);

    // Basic check: Did parsing succeed and return a tree?
    expect(result).not.toBeNull();

    // Check if the root node is of our expected CST type 'Program'
    expect(result?.type).toBe('Program');

    // TODO: Add more specific tests:
    // - Check for specific nodes within the tree.
    // - Use Visitor/Listener to extract information or build AST and test that.
    // - Test error handling for invalid syntax.
    // - Use snapshot testing for the parse tree structure.
  });

  it('should return null for empty input', () => {
      const code = '';
      const result = parseJavaScript(code);
      expect(result).toBeNull();
  });

  // TODO: Add tests for invalid syntax
});