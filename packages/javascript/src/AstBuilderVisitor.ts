// packages/javascript/src/AstBuilderVisitor.ts
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { CstNode, Position } from '@sylphlab/ast-core'; // Import base types
// Import generated Parser contexts and the Visitor interface
import {
    ProgramContext,
    StatementContext,
    VariableStatementContext, // Added
    ExpressionStatementContext, // Added
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
        // TODO: Add checks and calls for other statement types (if, block, etc.)

        console.warn("Unsupported Statement type encountered:", ctx.text);
        // Fallback for unhandled statement types
        return {
            type: 'UnsupportedStatement', // Or a more generic error node
            text: ctx.text,
            position: createPosition(ctx),
        };
    }

    visitVariableStatement(ctx: VariableStatementContext): VariableDeclaration | null {
        console.log("Visiting VariableStatement...");
        // TODO: Implement VariableDeclaration building logic
        // Need to visit variableDeclarationList -> variableDeclaration -> Identifier, Initialiser?
        const kind = ctx.Var()?.text as 'var' | 'let' | 'const' ?? 'var'; // Determine kind (let/const need grammar update)

        return {
            type: 'VariableDeclaration',
            text: ctx.text,
            position: createPosition(ctx),
            declarations: [], // Placeholder - need to visit children
            kind: kind,
        };
    }

     visitExpressionStatement(ctx: ExpressionStatementContext): ExpressionStatement | null {
        console.log("Visiting ExpressionStatement...");
        // TODO: Implement ExpressionStatement building logic
        // Need to visit expressionSequence -> singleExpression
        const expression = null; // Placeholder - need to visit child

        if (!expression) return null; // Or handle error

        return {
            type: 'ExpressionStatement',
            text: ctx.text,
            position: createPosition(ctx),
            expression: expression,
        };
    }


    // TODO: Implement visit methods for all relevant grammar rules
    // (Expressions, Declarations, Literals, etc.)
    // visitVariableDeclarationList, visitVariableDeclaration, visitInitialiser,
    // visitExpressionSequence, visitSingleExpression, visitLiteral, visitIdentifier, etc.

    // Override default behavior for terminals or error nodes if needed
    // visitTerminal(node: TerminalNode): CstNode | null { ... }
    // visitErrorNode(node: ErrorNode): CstNode | null { ... }

    // Default behavior if a visit method is not implemented
    protected defaultResult(): JsNode | null {
        return null; // Or return a generic 'Unknown' node
    }

    // Optional: Aggregate results from visiting children
    // protected aggregateResult(aggregate: JsNode | null, nextResult: JsNode | null): JsNode | null { ... }
}