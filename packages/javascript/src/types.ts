// packages/javascript/src/types.ts
import type { Token } from '@sylphlab/ast-core';

// Re-export core Token type if needed downstream
export type { Token };

// --- JavaScript Specific Token Types ---

/** Represents an identifier (variable name, function name, etc.). */
export interface Identifier extends Token {
  type: 'Identifier';
  // 'text' property from CstNode/Token holds the identifier name
}

/** Represents a JavaScript keyword (e.g., let, const, function, if). */
export interface Keyword extends Token {
  type: 'Keyword';
  // 'text' property holds the keyword
}

/** Represents a comment (single-line or multi-line). */
export interface Comment extends Token {
  type: 'Comment';
  // 'text' property holds the comment content including delimiters
}

/** Represents punctuation characters (e.g., {, }, (, ), ;, ,, ., =). */
export interface Punctuator extends Token {
  type: 'Punctuator';
  // 'text' property holds the punctuation character(s)
}

/** Represents a numeric literal. */
export interface NumericLiteral extends Token {
  type: 'NumericLiteral';
  value: number; // Store the parsed numeric value
}

/** Represents a string literal (including quotes). */
export interface StringLiteral extends Token {
  type: 'StringLiteral';
  value: string; // Store the parsed string value (without quotes?) - TBD
}

/** Represents a regular expression literal. */
export interface RegexLiteral extends Token {
    type: 'RegexLiteral';
    // value: RegExp; // Store the parsed RegExp object?
    pattern: string;
    flags: string;
}

// TODO: Add types for TemplateLiteral tokens, etc.


import type { CstNode, Position } from '@sylphlab/ast-core'; // Import CstNode and Position

// --- JavaScript Specific AST/CST Node Types ---

// Base type for all JS AST/CST nodes (can refine later)
export interface JsNode extends CstNode {}

// Base type for Statements
export interface Statement extends JsNode {}

// Base type for Expressions
export interface Expression extends JsNode {}

// Specific Node Types (Examples)

export interface Program extends JsNode {
    type: 'Program';
    body: Statement[]; // Sequence of statements or declarations
    // Add source type (script/module) if needed
}

export interface ExpressionStatement extends Statement {
    type: 'ExpressionStatement';
    expression: Expression;
}

// Example: Variable Declaration (var, let, const)
export interface VariableDeclaration extends Statement {
    type: 'VariableDeclaration';
    declarations: VariableDeclarator[];
    kind: 'var' | 'let' | 'const';
}

export interface VariableDeclarator extends JsNode {
    type: 'VariableDeclarator';
    id: Pattern; // Identifier or potentially object/array pattern
    init: Expression | null; // Initializer expression
}

// Patterns (used in declarations, assignments, etc.)
export interface Pattern extends JsNode {}

// Re-using Identifier Token as a basic Pattern/Expression for now
// Alternatively, define a specific AstIdentifier node
export interface AstIdentifier extends Expression, Pattern {
    type: 'Identifier';
    name: string; // Typically derived from node's text
}

// Re-using Literal Tokens as basic Expressions for now
// Alternatively, define specific AstLiteral nodes
export interface AstLiteral extends Expression {
    type: 'Literal';
    value: string | number | boolean | null | RegExp; // Can refine later
    raw?: string; // Original text representation
}

// TODO: Define many more node types:
// - Statements: IfStatement, ForStatement, WhileStatement, BlockStatement, ReturnStatement...
// - Expressions: BinaryExpression, UnaryExpression, CallExpression, MemberExpression, AssignmentExpression...
// - Declarations: FunctionDeclaration, ClassDeclaration...
// - Patterns: ObjectPattern, ArrayPattern...
// - Specific Literals: StringLiteral, NumericLiteral etc. if needed separate from Tokens