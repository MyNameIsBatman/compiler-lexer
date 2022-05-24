import { SymbolType, Token, TokenType } from "../lexer/Token";
import { NumberNode } from "./nodes/NumberNode";

const FACTORS: string[] = [TokenType.INTEGER, TokenType.FLOAT];
const TERMS: string[] = [SymbolType.MULTIPLY, SymbolType.DIVIDE];

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
  }

  private makeFactor(): NumberNode | null
  {
    if(!FACTORS.includes(this.currentToken.deepType)) return null;
    
    this.advance();
    return new NumberNode(this.currentToken);
  }

  private makeTerm(): void
  {
    const leftFactor: NumberNode | null = this.makeFactor();
    
    while(this.currentToken && TERMS.includes(this.currentToken.deepType))
    {
      //const operator: 
    }
  }
}