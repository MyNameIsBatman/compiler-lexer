import { LexerError, LexerErrors } from "./LexerError";
import { Token, TokenType } from "./Token";

const STARTING_DIGITS: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const DIGITS: string[] = [...STARTING_DIGITS, '.'];

const STARTING_CHARS: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const CHARS: string[] = [...STARTING_CHARS, ...STARTING_DIGITS, '_'];

const STRING_INIT_SYMBOL: string = '"';
const SYMBOLS: string[] = ['\'', '*', '-', '+', '/', ';', '{', '}', '(', ')', '=', '|', '&', '%', '!', '<', '>'];
const COMPOUND_SYMBOLS: string[] = [ '--', '++', '==', '!=', '<=', '>=', '||', '&&'];

const KEYWORDS: string[] = ['break','return','continue','for','while', 'var', 'const', 'if', 'else', 'elseif'];
const IGNORED_TOKENS: string[] = ['\n', '\t', ' '];

export class Lexer
{
  text: string;
  currentPosition: number;

  constructor(text: string)
  {
    this.text = text;
    this.currentPosition = -1;
  }

  private get currentChar(): string | null
  {
    return this.text[this.currentPosition] || null
  }

  private advance(): void
  {
    this.currentPosition++;
  }

  public findTokens(): Token[]
  {
    const tokens: Token[] = [];

    this.advance();
    while(this.currentChar)
    {
      if(IGNORED_TOKENS.includes(this.currentChar))
      {
        this.advance();
        continue;
      }

      if(STRING_INIT_SYMBOL === this.currentChar)
      {
        tokens.push(this.makeString());
        continue;
      }

      if(STARTING_CHARS.includes(this.currentChar))
      {
        tokens.push(this.makeIdentifier());
        continue;
      }

      if(SYMBOLS.includes(this.currentChar))
      {
        tokens.push(this.makeSymbol());
        continue;
      }

      if(STARTING_DIGITS.includes(this.currentChar))
      {
        tokens.push(this.makeNumber());
        continue;
      }

      this.error(LexerErrors.ILLEGAL_CHAR, `${this.currentChar} at position ${this.currentPosition}`);
    }

    return tokens;
  }

  private makeNumber(): Token
  {
    let numberStr: string = '';
    let dotCount: number = 0;

    while(this.currentChar && DIGITS.includes(this.currentChar))
    {
      if(this.currentChar === '.')
      {
        if(dotCount > 0) break;

        dotCount++;
      }
      
      numberStr = numberStr + this.currentChar;
      this.advance();
    }

    if(dotCount === 0) return new Token(TokenType.INTEGER, parseInt(numberStr));

    return new Token(TokenType.FLOAT, parseFloat(numberStr))
  }

  private makeIdentifier(): Token
  {
    let str: string = '';

    while(this.currentChar && CHARS.includes(this.currentChar.toLowerCase()))
    {
      str = str + this.currentChar;
      this.advance();
    }

    let type: string = TokenType.IDENTIFIER;

    if(KEYWORDS.includes(str)) type = TokenType.KEYWORD;

    return new Token(type, str);
  }

  private makeSymbol(): Token
  {
    let str: string = '';

    while(this.currentChar && SYMBOLS.includes(this.currentChar))
    {
      str = str + this.currentChar;
      this.advance();
      
      if(COMPOUND_SYMBOLS.includes(str)) return new Token(TokenType.COMPOUND_SYMBOL, str);      
    }

    return new Token(TokenType.SYMBOL, str);
  }

  private makeString(): Token
  {
    let str: string = '';
    let closedStr: boolean = false;

    this.advance();

    while(this.currentChar)
    {
      if(this.currentChar === STRING_INIT_SYMBOL)
      {
        closedStr = true;
        break;
      }

      str = str + this.currentChar;
      this.advance();
    }

    if(!closedStr) this.error(LexerErrors.NOT_CLOSED_STRING, `At position ${this.currentPosition}`);

    if(this.currentChar === STRING_INIT_SYMBOL) this.advance();

    return new Token(TokenType.STRING, str);
  }

  private error(type: string, message: string): void
  {
    throw new LexerError(type, message);
  }
}