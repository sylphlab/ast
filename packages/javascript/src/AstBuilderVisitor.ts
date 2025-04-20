// packages/javascript/src/AstBuilderVisitor.ts
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { CstNode, Position } from '@sylphlab/ast-core'; // Import base types
import { TerminalNode } from 'antlr4ts/tree/TerminalNode'; // Import TerminalNode
// Import generated Parser contexts and the Visitor interface
import {
    ProgramContext,
    StatementContext,
    VariableStatementContext, // Added
    ExpressionStatementContext, // Added
    BlockContext, // Added
    IfStatementContext, // Added
    VariableDeclarationListContext, // Added
    VariableDeclarationContext, // Added
    InitialiserContext, // Added
    ExpressionSequenceContext, // Added
    SingleExpressionContext, // Added
    LiteralContext, // Added
    StatementListContext, // Added
    // Labeled alternatives for singleExpression:
    LiteralExpressionContext, // Added
    IdentifierExpressionContext, // Added
    // ... import other relevant contexts as needed ...
} from './generated/grammar/ECMAScriptParser';
import { ECMAScriptVisitor } from './generated/grammar/ECMAScriptVisitor';

// Import our defined AST/CST node types
import {
    JsNode, // Base JS Node
    Program, // Specific Program Node
    Statement, // Base Statement
    ExpressionStatement, // Specific Statements...
    VariableDeclaration,
    VariableDeclarator,
    BlockStatement, // Added
    IfStatement, // Added
    Expression, // Base Expression
    Pattern, // Base Pattern
    AstIdentifier, // Specific Expressions/Patterns...
    AstLiteral,
} from './types';

/**
 * Helper to create a Position object from ANTLR context or tokens.
 * TODO: Move this to a shared utility?
 */
function createPosition(ctx: { start: { startIndex: number }, stop?: { stopIndex: number } | null }): Position {
     // ANTLR stopIndex is inclusive, our endOffset is exclusive
    const endIdx = ctx.stop?.stopIndex ?? ctx.start.startIndex;
    return {
        startOffset: ctx.start.startIndex,
        endOffset: endIdx + 1,
    };
}


/**
 * Visits the ANTLR Parse Tree and builds our custom CST/AST.
 */
export class AstBuilderVisitor extends AbstractParseTreeVisitor<JsNode | null> implements ECMAScriptVisitor<JsNode | null> {

    // Entry point
    visitProgram(ctx: ProgramContext): Program | null {
        console.log("Visiting Program...");
        const sourceElements = ctx.sourceElements();
        const body: Statement[] = sourceElements
            ? sourceElements.sourceElement().map(el => this.visit(el) as Statement).filter(s => s !== null)
            : [];

        return {
            type: 'Program',
            text: ctx.text, // Consider if text is needed on non-leaf nodes
            position: createPosition(ctx),
            body: body,
        };
    }

    // Statement dispatcher
    visitStatement(ctx: StatementContext): Statement | null {
        console.log("Visiting Statement...");
        if (ctx.variableStatement()) {
            return this.visitVariableStatement(ctx.variableStatement()!);
        }
        if (ctx.expressionStatement()) {
            return this.visitExpressionStatement(ctx.expressionStatement()!);
        }
        if (ctx.block()) {
            return this.visitBlock(ctx.block()!);
        }
        if (ctx.ifStatement()) {
            return this.visitIfStatement(ctx.ifStatement()!);
        }
        // TODO: Add checks and calls for other statement types (iteration, return, etc.)

        console.warn("Unsupported Statement type encountered:", ctx.text);
        // Fallback for unhandled statement types
        return {
            type: 'UnsupportedStatement', // Or a more generic error node
            text: ctx.text,
            position: createPosition(ctx),
        };
    }

    visitBlock(ctx: BlockContext): BlockStatement | null {
        console.log("Visiting Block...");
        const statementListCtx = ctx.statementList();
        // Inline visitStatementList logic
        const body: Statement[] = statementListCtx
            ? statementListCtx.statement()
                .map((stmtCtx: StatementContext) => this.visitStatement(stmtCtx))
                .filter((stmt): stmt is Statement => stmt !== null)
            : [];
        return {
            type: 'BlockStatement',
            text: ctx.text,
            position: createPosition(ctx),
            body: body,
        };
    }

    visitIfStatement(ctx: IfStatementContext): IfStatement | null {
        console.log("Visiting IfStatement...");
        const testExpr = this.visitExpressionSequence(ctx.expressionSequence());
        const consequentStmt = this.visitStatement(ctx.statement(0)); // First statement is consequent
        const alternateStmt = ctx.statement(1) ? this.visitStatement(ctx.statement(1)!) : null; // Second (optional) is alternate

        if (!testExpr || !consequentStmt) {
            console.error("Could not build IfStatement: missing test or consequent.", ctx.text);
            return null; // Or handle error more gracefully
        }

        return {
            type: 'IfStatement',
            text: ctx.text,
            position: createPosition(ctx),
            test: testExpr,
            consequent: consequentStmt,
            alternate: alternateStmt,
        };
    }

    visitVariableStatement(ctx: VariableStatementContext): VariableDeclaration | null {
        console.log("Visiting VariableStatement...");
        const declarationListCtx = ctx.variableDeclarationList();
        // Inline visitVariableDeclarationList logic
        const declarations: VariableDeclarator[] = declarationListCtx
            ? declarationListCtx.variableDeclaration()
                .map((declCtx: VariableDeclarationContext) => this.visitVariableDeclaration(declCtx))
                .filter((decl): decl is VariableDeclarator => decl !== null)
            : [];

        // TODO: Improve kind detection if grammar supports let/const
        const kind = ctx.Var()?.text as 'var' | 'let' | 'const' ?? 'var';

        return {
            type: 'VariableDeclaration',
            text: ctx.text,
            position: createPosition(ctx),
            declarations: declarations,
            kind: kind,
        };
    }

    visitVariableDeclaration(ctx: VariableDeclarationContext): VariableDeclarator | null {
        console.log("Visiting VariableDeclaration...");
        const idNode = ctx.Identifier(); // Get the terminal node
        const initialiserCtx = ctx.initialiser();

        if (!idNode) {
            console.error("VariableDeclarator missing Identifier", ctx.text);
            return null;
        }

        // Create AstIdentifier from TerminalNode
        const identifier: AstIdentifier = {
            type: 'Identifier',
            name: idNode.text,
            text: idNode.text,
            position: { // Position from the terminal node itself
                startOffset: idNode.symbol.startIndex,
                endOffset: idNode.symbol.stopIndex + 1,
            }
        };

        const initExpr = initialiserCtx ? this.visitInitialiser(initialiserCtx) : null;

        return {
            type: 'VariableDeclarator',
            text: ctx.text,
            position: createPosition(ctx),
            id: identifier, // Use the created AstIdentifier
            init: initExpr,
        };
    }

    visitInitialiser(ctx: InitialiserContext): Expression | null {
        console.log("Visiting Initialiser...");
        const exprCtx = ctx.singleExpression();
        return exprCtx ? this.visit(exprCtx) as Expression | null : null;
    }


     visitExpressionStatement(ctx: ExpressionStatementContext): ExpressionStatement | null {
        console.log("Visiting ExpressionStatement...");
        const expression = ctx.expressionSequence() ? this.visitExpressionSequence(ctx.expressionSequence()!) : null;

        if (!expression) {
            console.error("ExpressionStatement missing expression", ctx.text);
            return null; // Or handle error
        }

        return {
            type: 'ExpressionStatement',
            text: ctx.text,
            position: createPosition(ctx),
            expression: expression,
        };
    }

    visitExpressionSequence(ctx: ExpressionSequenceContext): Expression | null {
        console.log("Visiting ExpressionSequence...");
        // For now, just visit the first expression in the sequence
        const firstExprCtx = ctx.singleExpression(0);
        if (!firstExprCtx) return null;
        // TODO: Handle sequences properly (e.g., SequenceExpression node) if needed
        return this.visit(firstExprCtx) as Expression | null;
    }

    // --- Expression Handling ---

    // Overload visit to handle SingleExpressionContext specifically if needed,
    // or rely on the default visit calling the labeled alternatives below.
    // visitSingleExpression(ctx: SingleExpressionContext): Expression | null { ... }

    // --- Labeled Alternatives for singleExpression ---
    // These methods are automatically called by the base visit method
    // when it encounters a context matching the label in the grammar.

    // Handles: singleExpression # LiteralExpression
    visitLiteralExpression(ctx: LiteralExpressionContext): AstLiteral | null {
        console.log("Visiting LiteralExpression (#LiteralExpression)...");
        // The context here *is* the LiteralExpressionContext, which contains literal()
        const literalCtx = ctx.literal();
        return literalCtx ? this.visitLiteral(literalCtx) : null;
    }

    // Handles: singleExpression # IdentifierExpression
    visitIdentifierExpression(ctx: IdentifierExpressionContext): AstIdentifier | null {
         console.log("Visiting IdentifierExpression (#IdentifierExpression)...");
         // The context here *is* the IdentifierExpressionContext, which contains Identifier()
         const idNode = ctx.Identifier(); // Get terminal node
         if (!idNode) return null;

         return {
             type: 'Identifier',
             name: idNode.text,
             text: idNode.text,
             position: {
                 startOffset: idNode.symbol.startIndex,
                 endOffset: idNode.symbol.stopIndex + 1,
             }
         };
    }

    // TODO: Add visit methods for other singleExpression labeled alternatives as needed
    // visitParenthesizedExpression, visitMemberDotExpression, etc.


    visitLiteral(ctx: LiteralContext): AstLiteral | null {
        console.log("Visiting Literal...");
        let value: string | number | boolean | null | RegExp = null;
        const raw = ctx.text;

        if (ctx.NullLiteral()) {
            value = null;
        } else if (ctx.BooleanLiteral()) {
            value = ctx.BooleanLiteral()!.text === 'true';
        } else if (ctx.StringLiteral()) {
            // Remove quotes for the value
            const text = ctx.StringLiteral()!.text;
            value = text.substring(1, text.length - 1);
            // TODO: Handle escape sequences within the string value
        } else if (ctx.numericLiteral()) {
            // ANTLR text should be the valid number string
            try {
                // Use parseFloat for broader number format support initially
                value = parseFloat(raw);
                if (isNaN(value)) { // Handle cases like '0x' which parseFloat might return NaN for
                     console.error("Failed to parse numeric literal (NaN):", raw);
                     value = null; // Or keep NaN? Let's use null for consistency
                }
            } catch (e) {
                console.error("Failed to parse numeric literal:", raw, e);
                value = null; // Keep value as null on error
            }
        } else if (ctx.RegularExpressionLiteral()) {
            // Basic parsing, might need refinement
            const match = raw.match(/^\/(.+)\/([gimyus]*)$/);
            if (match) {
                // Ensure both pattern and flags are valid before creating RegExp
                if (typeof match[1] === 'string') {
                    try {
                        value = new RegExp(match[1], match[2] || '');
                    } catch (e) {
                         console.error("Failed to parse regex literal:", raw, e);
                         value = null; // Keep value as null on error
                    }
                } else {
                    console.error("Could not extract regex pattern:", raw);
                    value = null; // Keep value as null
                }
            } else { // Closing brace for 'if (match)'
                 console.error("Could not parse regex literal structure:", raw);
                 value = null; // Keep value as null
            }
        } else {
            console.warn("Unrecognized literal type:", raw);
            return null;
        }

        return {
            type: 'Literal',
            text: raw,
            position: createPosition(ctx),
            value: value,
            raw: raw,
        };
    }


    // TODO: Implement visit methods for other relevant grammar rules
    // (More Expressions, Declarations, etc.)


    // Override default behavior for terminals or error nodes if needed
    // visitTerminal(node: TerminalNode): CstNode | null { ... }
    // visitErrorNode(node: ErrorNode): CstNode | null { ... }

    // Default behavior if a visit method is not implemented
    protected defaultResult(): JsNode | null {
        // console.log("Default result called for node"); // Optional logging
        return null; // Or return a generic 'Unknown' node
    }

    // Optional: Aggregate results from visiting children
    // protected aggregateResult(aggregate: JsNode | null, nextResult: JsNode | null): JsNode | null { ... }
}