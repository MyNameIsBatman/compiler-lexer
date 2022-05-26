import { VariableAccessNode } from './nodes/VariableAccessNode';
import { ParserResult } from './ParserResult';
import { ParserError, ParserErrors } from './ParserError';
import { UnaryOperationNode } from './nodes/UnaryOperationNode';
import { ParserNode } from './nodes/ParserNode';
import { BinaryOperationNode } from './nodes/BinaryOperationNode';
import { KeywordType, SymbolType, Token, TokenType } from "../lexer/Token";
import { NumberNode } from "./nodes/NumberNode";
import { VariableAssignementNode } from './nodes/VariableAssignementNode';

//BY PRIORITY
const ATOMS: string[][] = [
  [TokenType.INTEGER, TokenType.FLOAT]
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
    const result = this.makeExpression();

    if (result != null) console.log(result.getRepresentation());
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
    }

    if (!node) throw new ParserError(ParserErrors.TOKEN_EXPECTED, [...ATOMS[0], ...FACTORS[0], SymbolType.LEFT_PARENTHESES].toString());
    
    return node;
  }

  private makePower(): ParserNode
  {
    let node: ParserNode = this.makeAtom();
    
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
}