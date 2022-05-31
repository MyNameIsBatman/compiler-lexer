import { ForNode } from './nodes/ForNode';
import { IfNode } from './nodes/IfNode';
import { IfCase } from './nodes/IfCase';
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
import { WhileNode } from './nodes/WhileNode';
import { FunctionAssignementNode } from './nodes/FunctionAssignementNode';
import { CodeBlockNode } from './nodes/CodeBlockNode';

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
  [SymbolType.AND, SymbolType.OR]
];

export class Parser
{
  tokens: Token[];
  currentPosition: number;

  constructor(tokens: Token[])
  {
    this.tokens = tokens;
    this.currentPosition = 0;
  }

  private get currentToken(): Token
  {
    return this.tokens[this.currentPosition]
  }

  private get currentType(): string
  {
    return this.currentToken ? this.currentToken.deepType : '';
  }

  private advance(): void
  {
    this.currentPosition++;
  }

  private makeWhile(): ParserNode
  {
    if (this.currentType !== SymbolType.LEFT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_PARENTHESES);

    this.advance();

    const condition: ParserNode = this.makeExpression();

    if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);

    this.advance();

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    const body: ParserNode = this.makeCodeBlock();

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    return new WhileNode(condition, body);
  }

  private makeFor(): ParserNode
  {
    if (this.currentType !== SymbolType.LEFT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_PARENTHESES);

    this.advance();

    if (this.currentType !== TokenType.IDENTIFIER) throw new ParserError(ParserErrors.TOKEN_EXPECTED, TokenType.IDENTIFIER);

    const identifier: Token = this.currentToken;

    this.advance();

    if (this.currentType !== SymbolType.ATTRIBUTION) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.ATTRIBUTION);

    this.advance();

    const initialValue: ParserNode = this.makeExpression();

    if (this.currentType !== KeywordType.TO) throw new ParserError(ParserErrors.TOKEN_EXPECTED, KeywordType.TO);

    this.advance();

    const targetValue: ParserNode = this.makeExpression();

    if (this.currentType !== KeywordType.STEP) throw new ParserError(ParserErrors.TOKEN_EXPECTED, KeywordType.STEP);

    this.advance();

    const step: ParserNode = this.makeExpression();

    if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);

    this.advance();

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    const body: ParserNode = this.makeCodeBlock();

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    return new ForNode(identifier, initialValue, targetValue, step, body);
  }

  private makeIf(): ParserNode
  {
    const cases: IfCase[] = [];
    let elseCase: ParserNode | null = null;

    if (this.currentType !== SymbolType.LEFT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_PARENTHESES);

    this.advance();

    const condition: ParserNode = this.makeExpression();

    if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);

    this.advance();

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    const body: ParserNode = this.makeCodeBlock();

    cases.push(new IfCase(condition, body));

    while (this.currentType === TokenType.END_OF_LINE) this.advance();

    while (this.currentType === KeywordType.ELSEIF)
    {
      this.advance();

      if (this.currentType !== SymbolType.LEFT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_PARENTHESES);

      this.advance();

      const condition: ParserNode = this.makeExpression();

      if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);

      this.advance();

      while (this.currentType === TokenType.END_OF_LINE) this.advance();

      const body: ParserNode = this.makeCodeBlock();

      cases.push(new IfCase(condition, body));

      while (this.currentType === TokenType.END_OF_LINE) this.advance();
    }

    if (this.currentType === KeywordType.ELSE)
    {
      this.advance();

      while (this.currentType === TokenType.END_OF_LINE) this.advance();
      
      elseCase = this.makeCodeBlock();

      while (this.currentType === TokenType.END_OF_LINE) this.advance();
    }

    return new IfNode(cases, elseCase);
  }

  private makeAtom(): ParserNode
  {
    let node: ParserNode | null = null;

    if (this.currentToken)
    {
      if (ATOMS[0].includes(this.currentType))
      {
        node = new NumberNode(this.currentToken);
        this.advance();
      }
      else if (ATOMS[1].includes(this.currentType))
      {
        node = new StringNode(this.currentToken);
        this.advance();
      }
      else if (this.currentType === TokenType.IDENTIFIER)
      {
        node = new VariableAccessNode(this.currentToken);
        this.advance();
      }
      else if (this.currentType === SymbolType.LEFT_PARENTHESES)
      {
        this.advance();
        const expression: ParserNode = this.makeExpression();
  
        if (this.currentType === SymbolType.RIGHT_PARENTHESES)
        {
          this.advance();
          node = expression;
        }
        else throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);
      }
      else if (this.currentType === KeywordType.IF)
      {
        this.advance();
        node = this.makeIf();
      }
      else if (this.currentType === KeywordType.FOR)
      {
        this.advance();
        node = this.makeFor();
      }
      else if (this.currentType === KeywordType.WHILE)
      {
        this.advance();
        node = this.makeWhile();
      }
    }

    if (!node) throw new ParserError(ParserErrors.TOKEN_EXPECTED, [...ATOMS[0], ...ATOMS[1], ...FACTORS[0], KeywordType.IF, TokenType.IDENTIFIER, SymbolType.LEFT_PARENTHESES].toString());
    
    return node;
  }

  private makeCall(): ParserNode
  {
    let node: ParserNode = this.makeAtom();

    if (this.currentType === SymbolType.LEFT_PARENTHESES)
    {
      this.advance();
      const argumentsNodes: ParserNode[] = [];
      
      if (this.currentType === SymbolType.RIGHT_PARENTHESES)
      {
        this.advance();
      }
      else
      {
        argumentsNodes.push(this.makeExpression());

        while (this.currentType === SymbolType.COMMA)
        {
          this.advance();

          argumentsNodes.push(this.makeExpression());
        }

        if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);
      
        this.advance();
      }

      return new CallingNode(node, argumentsNodes);
    }

    return node;
  }

  private makePower(): ParserNode
  {
    let node: ParserNode = this.makeCall();
    
    while (this.currentType === SymbolType.POWER)
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

    if (FACTORS[0].includes(this.currentType))
    {
      const cacheToken = this.currentToken;
      this.advance();
      
      node = new UnaryOperationNode(cacheToken, this.makeFactor());
    }
    else
    {
      node = this.makePower();
    }

    if (!node) throw new ParserError(ParserErrors.TOKEN_EXPECTED, [...FACTORS[0]].toString());
    
    return node;
  }

  private makeTerm(): ParserNode
  {
    let node: ParserNode = this.makeFactor();
    
    while (TERMS.includes(this.currentType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const rightFactor: ParserNode = this.makeFactor();
      node = new BinaryOperationNode(node, operator, rightFactor);
    }

    return node;
  }

  private makeArithmeticExpression(): ParserNode
  {
    let node: ParserNode = this.makeTerm();
    
    while ([SymbolType.PLUS, SymbolType.MINUS].includes(this.currentType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const right: ParserNode = this.makeTerm();
      node = new BinaryOperationNode(node, operator, right);
    }

    return node;
  }

  private makeComparisonExpression(): ParserNode
  {
    if (this.currentType === SymbolType.EXCLAMATION)
    {
      const operation: Token = this.currentToken;
      this.advance();

      const node: ParserNode = this.makeComparisonExpression();

      return new UnaryOperationNode(operation, node);
    }

    let node: ParserNode = this.makeArithmeticExpression();

    while ([SymbolType.EQUALS, SymbolType.NOT_EQUAL, SymbolType.MORE_THAN, SymbolType.LESS_THAN, SymbolType.MORE_OR_EQUALS_TO, SymbolType.LESS_OR_EQUALS_TO].includes(this.currentType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const right: ParserNode = this.makeArithmeticExpression();
      node = new BinaryOperationNode(node, operator, right);
    }

    return node;
  }

  private makeExpression(): ParserNode
  {
    if (this.currentType === KeywordType.FUNCTION)
    {
      this.advance();

      if (this.currentType !== TokenType.IDENTIFIER) throw new ParserError(ParserErrors.TOKEN_EXPECTED, TokenType.IDENTIFIER);

      const identifier: Token = this.currentToken;
      this.advance();

      if (this.currentType !== SymbolType.LEFT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_PARENTHESES);

      this.advance();

      const parameters: Token[] = [];

      if (this.currentType === TokenType.IDENTIFIER)
      {
        parameters.push(this.currentToken);
        this.advance();

        while (this.currentType === SymbolType.COMMA)
        {
          this.advance();

          if (this.currentType !== TokenType.IDENTIFIER) throw new ParserError(ParserErrors.TOKEN_EXPECTED, TokenType.IDENTIFIER);
        
          parameters.push(this.currentToken);

          this.advance();
        }
      }

      if (this.currentType !== SymbolType.RIGHT_PARENTHESES) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_PARENTHESES);

      this.advance();

      while (this.currentType === TokenType.END_OF_LINE) this.advance();

      const body: ParserNode = this.makeCodeBlock();

      while (this.currentType === TokenType.END_OF_LINE) this.advance();

      return new FunctionAssignementNode(identifier, parameters, body);
    }

    if (EXPRESSIONS[0].includes(this.currentType))
    {
      this.advance();

      if (this.currentType !== TokenType.IDENTIFIER) throw new ParserError(ParserErrors.TOKEN_EXPECTED, TokenType.IDENTIFIER);

      const identifier: Token = this.currentToken;
      this.advance();

      if (this.currentType !== SymbolType.ATTRIBUTION) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.ATTRIBUTION);

      this.advance();

      const expression: ParserNode = this.makeExpression();

      return new VariableAssignementNode(identifier, expression);
    }

    let node: ParserNode = this.makeComparisonExpression();
    
    while (EXPRESSIONS[1].includes(this.currentType))
    {
      const operator: Token = this.currentToken;
      this.advance();

      const right: ParserNode = this.makeComparisonExpression();
      node = new BinaryOperationNode(node, operator, right);
    }

    return node;
  }

  public makeCodeBlock(): ParserNode
  {
    const nodes: ParserNode[] = [];

    if (this.currentType !== SymbolType.LEFT_BRACE) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.LEFT_BRACE);

    this.advance();

    while(this.currentType !== SymbolType.RIGHT_BRACE)
    {
      if (this.currentType === TokenType.END_OF_LINE)
      {
        this.advance();
        continue;
      }

      nodes.push(this.makeExpression());
    }

    if (this.currentType !== SymbolType.RIGHT_BRACE) throw new ParserError(ParserErrors.TOKEN_EXPECTED, SymbolType.RIGHT_BRACE);

    this.advance();

    return new CodeBlockNode(nodes);
  }
}