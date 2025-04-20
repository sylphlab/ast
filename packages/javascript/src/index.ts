// packages/javascript/src/index.ts
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ECMAScriptLexer } from './generated/grammar/ECMAScriptLexer';
import { ECMAScriptParser, ProgramContext } from './generated/grammar/ECMAScriptParser';
// Keep CstNode if we plan to transform the ParseTree later
import type { CstNode } from '@sylphlab/ast-core';
import { AstBuilderVisitor } from './AstBuilderVisitor'; // Import the visitor

/**
 * Parses JavaScript code using ANTLR-generated parser.
 *
 * @param text The JavaScript source code.
 * @returns The root node of our custom CST/AST, or null on failure.
 */
export function parseJavaScript(text: string): CstNode | null { // Return our CstNode
  if (!text) {
    // Handle empty input if necessary, maybe return a specific empty tree representation
    return null;
  }
  console.log('Parsing JavaScript using ANTLR...');

  // Create stream from input string
  const inputStream = CharStreams.fromString(text);

  // Create Lexer
  const lexer = new ECMAScriptLexer(inputStream);
  // TODO: Add error listeners to lexer?

  // Create TokenStream
  const tokenStream = new CommonTokenStream(lexer);

  // Create Parser
  const parser = new ECMAScriptParser(tokenStream);
  // TODO: Add error listeners to parser?
  // parser.buildParseTree = true; // Default is true

  // Start parsing from the entry rule ('program' in ECMAScript.g4)
  try {
    const tree = parser.program(); // Get the ANTLR Parse Tree root
    console.log('ANTLR parsing finished. Building AST...');

    // Create visitor instance
    const visitor = new AstBuilderVisitor();
    // Visit the tree to build our AST/CST
    const astRoot = visitor.visit(tree);

    console.log('AST building finished.');
    return astRoot; // Return our AST/CST root node

  } catch (error) {
      console.error("Error during ANTLR parsing or AST building:", error);
      return null; // Indicate failure
  }
}

// --- Remove or comment out old code ---
/*
import type { Position, Point } from '@sylphlab/ast-core'; // No longer needed directly here

export interface Edit {
  startIndex: number;
  oldEndIndex: number;
  newEndIndex: number;
}

export function parseIncrementally(
  text: string,
  previousTree?: CstNode,
  edits?: Edit[]
): CstNode {
  // ... old placeholder logic ...
  console.warn("Old parseIncrementally function called - should use parseJavaScript with ANTLR now.");
  // Return a dummy node or throw error
  const dummyPos: Position = { offset: 0 }; // Using simplified Position temporarily
  return { type: 'root', text: '', position: { start: dummyPos, end: dummyPos } };
}

export const version = '0.0.0';
*/

// --- Placeholder export if needed ---
export const version = '0.0.0-antlr';