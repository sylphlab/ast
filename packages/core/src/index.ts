// packages/core/src/index.ts - CST Base

/**
 * Represents a specific location in a source file.
 */
export interface Point {
  /** Character index (0-based) in the source file. */
  offset: number;
  // Temporarily removing line and column
  // line: number;
  // column: number;
}

/**
 * Represents a span of content in a source file.
 */
export interface Position {
  /** The starting character index (0-based) of the span. */
  startOffset: number;
  /** The ending character index (0-based, exclusive) of the span. */
  endOffset: number;
  // Temporarily replacing start/end points with simple offsets
  // start: Point;
  // end: Point;
}

/**
 * Base interface for all nodes in the Concrete Syntax Tree (CST).
 * Represents a concrete piece of syntax from the source text.
 */
export interface CstNode {
  /** The type of the syntax node (e.g., 'Paragraph', 'Heading', 'Identifier', 'Whitespace', 'Asterisk'). */
  type: string;
  /** The exact source text covered by this node. */
  text: string;
  /** Location of the node in the source file. */
  position: Position; // Position is generally non-optional for CST nodes
  /** Child nodes, if this node represents a grammatical rule (non-terminal). Leaf nodes (tokens) typically have no children. */
  children?: CstNode[];
  /** Potential link to a parent node (optional, might be managed externally). */
  // parent?: CstNode;
  /** Indicates if the node or its children contain syntax errors (useful for resilience). */
  // hasError?: boolean;
}

// --- Base Token Type ---
/**
 * Base interface for a token (leaf node in the CST).
 */
export interface Token extends CstNode {
  // Tokens typically don't have children
  children?: undefined;
}

// --- Common Token Types ---

export interface Whitespace extends Token {
  type: 'Whitespace'; // Includes spaces and tabs
}

export interface Newline extends Token {
  type: 'Newline';
}

export interface Word extends Token {
  type: 'Word'; // General text content
}

export interface Punctuation extends Token {
  type: 'Punctuation'; // e.g., '.', '!', '?'
}

// --- Markdown Specific Tokens / Leaf Nodes ---

export interface HeadingMarker extends Token {
  type: 'HeadingMarker'; // Sequence of '#'
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ListItemMarker extends Token {
  type: 'ListItemMarker'; // e.g., '*', '-', '+', '1.', 'a)'
  markerType: '*' | '-' | '+' | '.' | ')'; // Distinguish ordered/unordered/delimiter
  // Add 'order' for ordered lists if needed
}

export interface EmphasisMarker extends Token {
  type: 'EmphasisMarker'; // '*' or '_'
  marker: '*' | '_';
}

export interface CodeDelimiter extends Token {
  type: 'CodeDelimiter'; // '`' or '```'
  marker: '`' | '```';
  // Could add info like language for fenced code blocks later
}

export interface LinkLabelStart extends Token { type: 'LinkLabelStart'; } // '['
export interface LinkLabelEnd extends Token { type: 'LinkLabelEnd'; } // ']'
export interface LinkUrlStart extends Token { type: 'LinkUrlStart'; } // '('
export interface LinkUrlEnd extends Token { type: 'LinkUrlEnd'; } // ')'

// --- Markdown Specific Rule / Non-Leaf Nodes ---
// These typically have children

export interface ParagraphBlock extends CstNode {
  type: 'Paragraph'; // Represents a paragraph block
  children: CstNode[]; // Contains inline content tokens/nodes
}

export interface HeadingBlock extends CstNode {
  type: 'Heading'; // Represents a full heading block
  children: CstNode[]; // Contains marker and inline content
}

export interface EmphasisInline extends CstNode {
  type: 'Emphasis'; // Represents an emphasis span
  children: CstNode[]; // Contains markers and inline content
}

export interface StrongInline extends CstNode {
  type: 'Strong'; // Represents a strong emphasis span
  children: CstNode[]; // Contains markers and inline content
}

export interface CodeSpan extends CstNode {
  type: 'CodeSpan'; // Represents an inline code span
  children: CstNode[]; // Contains delimiters and text
}

export interface CodeBlock extends CstNode {
    type: 'CodeBlock'; // Represents a fenced or indented code block
    children: CstNode[]; // Contains delimiters, language info (optional), code text
}

export interface ListItem extends CstNode {
    type: 'ListItem';
    children: CstNode[]; // Contains marker, whitespace, block content
}

export interface ListBlock extends CstNode {
    type: 'List'; // Ordered or Unordered
    children: ListItem[];
}


// --- Union type for potential children (example) ---
// export type InlineContent = Word | Whitespace | Punctuation | EmphasisMarker | CodeDelimiter | ...


// --- Placeholder ---
export const version = '0.0.0';

// TODO: Refine CstNode structure based on chosen parsing algorithm.
// TODO: Define many more specific types for Markdown (Blockquote, Links, Images, Tables, etc.)
// TODO: Refine relationships and child types for Rule nodes