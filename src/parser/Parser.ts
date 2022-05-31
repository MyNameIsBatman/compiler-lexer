import { VariableAccessNode } from './nodes/VariableAccessNode';
import { CallingNode } from './nodes/CallingNode';
import { StringNode } from './nodes/StringNode';
import { ParserError, ParserErrors } from './ParserError';
import { UnaryOperationNode } from './nodes/UnaryOperationNode';
import { ParserNode } from './nodes/ParserNode';
import { BinaryOperationNode } from './nodes/BinaryOperationNode';
import { KeywordType, SymbolType, Token, TokenType } from "../lexer/Token";
import { NumberNode } from "./nodes/NumberNode";
import { VariableAssignementNode } from './nodes/VariableAssignementNode';

//BY PRIORITY
const ATOMS: string[][] = [
  [TokenType.INTEGER, TokenType.FLOAT],
  [TokenType.STRING]
];

const FACTORS: string[][] = [
  [SymbolType.PLUS, SymbolType.MINUS],
];

const TERMS: string[] = [SymbolType.MULTIPLY, SymbolType.DIVIDE];
const EXPRESSIONS: string[][] = [
  [KeywordType.VAR, KeywordType.CONST],
  [SymbolType.PLUS, SymbolType.MINUS]
];

export class Parser
{
  tokens: Token[];
  currentPosition: number;

  constructor(tokens: Token[])
  {
    this.tokens = tokens;
    this.currentPosition = -1;
  }

  private get currentToken(): Token | null
  {
    return this.tokens[this.currentPosition] || null
  }

  private advance(): void
  {
    this.currentPosition++;
  }

  public buildTree(): void
  {
    this.advance();
    const result = this.makeProgram();

    if (result != null)
    {
      const table: { representation: string }[] = [];

      for (const item of result) table.push({ representation: item.representation });

      console.table(table);
    }
  }

  private makeIf(): void
  {
    
  }

  private makeAtom(): ParserNode
  {
    let node: ParserNode | null = null;

    if (this.currentToken)
    {
      if (ATOMS[0].includes(this.currentToken.deepType))
      {
        node = new NumberNode(this.currentToken);
        this.advance();
      }
      else if (ATOMS[1].includes(this.currentToken.deepType))
      {
        node = new StringNode(this.currentToken);
        this.advance();
      }
      else if (this.currentToken.deepType === TokenType.IDENTIFIER)
      {
        node = new VariableAccessNode(this.currentToken);
        this.advance();
      }
      else if (this.currentToken.deepType === SymbolType.LEFT_PARENTHESES)
      {
        this.advance();
        const expression: ParserNode = this.makeExpression();
  
        if (this.currentToken.deepType === SymbolType.RIGHT_PARENTHESES)
        {
          this.advance();
          node = expression;
        }
        else throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);
      }
      else if (this.currentToken.deepType === KeywordType.IF)
      {

      }
    }
    console.log(this.currentToken);
    if (!node) throw new ParserError(ParserErrors.TOKEN_EXPECTED, [...ATOMS[0], ...ATOMS[1], ...FACTORS[0], TokenType.IDENTIFIER, SymbolType.LEFT_PARENTHESES].toString());
    
    return node;
  }

  private makeCall(): ParserNode
  {
    let node: ParserNode = this.makeAtom();

    if (this.currentToken && this.currentToken.deepType === SymbolType.LEFT_PARENTHESES)
    {
      this.advance();
      const argumentsNodes: ParserNode[] = [];
      
      if (this.currentToken && this.currentToken.deepType === SymbolType.RIGHT_PARENTHESES)
      {
        this.advance();
      }
      else
      {
        argumentsNodes.push(this.makeExpression());

        while (this.currentToken && this.currentToken.deepType === SymbolType.COMMA)
        {
          this.advance();

          argumentsNodes.push(this.makeExpression());
        }

        if (!this.currentToken || this.currentToken.deepType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);
      
        this.advance();
      }

      return new CallingNode(node, argumentsNodes);
    }

    return node;
  }

  private makePower(): ParserNode
  {
    let node: ParserNode = this.makeCall();
    
    while (this.currentToken && this.currentToken.deepType === SymbolType.POWER)
    {
      const operator: Token = this.currentToken;
      this.advance();

      const rightFactor: ParserNode = this.makeFactor();
      node = new BinaryOperationNode(node, operator, rightFactor);
    }

    return node;
  }

  private makeFactor(): ParserNode
  {
    let node: ParserNode | null = null;

    if (this.currentToken)
    {
      if (FACTORS[0].includes(this.currentToken.deepType))
      {
        const cacheToken = this.currentToken;
        this.advance();
        
        node = new UnaryOperationNode(cacheToken, this.makeFactor());
      }
      else
      {
        node = this.makePower();
      }
    }

    if (!node) throw new ParserError(ParserErrors.TOKEN_EXPECTED, [...FACTORS[0]].toString());
    
    return node;
  }

  private makeTerm(): ParserNode
  {
    let node: ParserNode = this.makeFactor();
    
    while (this.currentToken && TERMS.includes(this.currentToken.deepType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const rightFactor: ParserNode = this.makeFactor();
      node = new BinaryOperationNode(node, operator, rightFactor);
    }

    return node;
  }

  private makeExpression(): ParserNode
  {
    if (this.currentToken && EXPRESSIONS[0].includes(this.currentToken.deepType))
    {
      this.advance();

      if (!this.currentToken || this.currentToken.deepType !== TokenType.IDENTIFIER) throw new ParserError(ParserErrors.TOKEN_EXPECTED, TokenType.IDENTIFIER);

      const identifier: Token = this.currentToken;
      this.advance();

      if (!this.currentToken || this.currentToken.deepType !== SymbolType.ATTRIBUTION) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.ATTRIBUTION);

      this.advance();

      const expression: ParserNode = this.makeExpression();

      return new VariableAssignementNode(identifier, expression);
    }

    let node: ParserNode = this.makeTerm();
    
    while (this.currentToken && EXPRESSIONS[1].includes(this.currentToken.deepType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const rightTerm: ParserNode = this.makeTerm();
      node = new BinaryOperationNode(node, operator, rightTerm);
    }

    return node;
    
  }

  public makeStatement(): ParserNode
  {
    const expression: ParserNode = this.makeExpression();

    if (!this.currentToken || ![TokenType.END_OF_LINE, TokenType.END_OF_FILE].includes(this.currentToken.deepType))
    {
      throw new ParserError(ParserErrors.TOKEN_EXPECTED, [TokenType.END_OF_LINE, TokenType.END_OF_FILE].toString());
    }
    
    return expression;
  }

  public makeProgram(): ParserNode[]
  {
    const nodes: ParserNode[] = [];

    while(this.currentToken)
    {
      if (this.currentToken.deepType === TokenType.END_OF_FILE) break;

      if (this.currentToken.deepType === TokenType.END_OF_LINE)
      {
        this.advance();
        continue;
      }

      nodes.push(this.makeStatement());
    }

    return nodes;
  }
}