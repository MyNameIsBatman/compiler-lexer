import { LexerError, LexerErrors } from "./LexerError";
import { KeywordType, SymbolType, Token, TokenType } from "./Token";

const STARTING_DIGITS: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const DIGITS: string[] = [...STARTING_DIGITS, '.'];

const STARTING_CHARS: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const CHARS: string[] = [...STARTING_CHARS, ...STARTING_DIGITS, '_'];

const STRING_INIT_SYMBOL: string = '"';
const STRING_STOP_SYMBOL: string = '"';
const COMMENT_INIT_SYMBOL: string = '//';
const COMMENT_STOP_SYMBOL: string = '\n';

const SYMBOLS: string[] = ['\'', '*', '-', '+', '/', ';', '{', '}', '(', ')', '=', '|', '&', '%', '!', '<', '>', '^'];
const COMPOUND_SYMBOLS: string[] = [ '--', '++', '==', '===', '!=', '<=', '>=', '||', '&&'];

const KEYWORDS: string[] = ['break','return','continue','for','while', 'var', 'const', 'if', 'else', 'elseif', 'print', 'read'];
const IGNORED_TOKENS: string[] = ['\n', '\t', '\r', ' '];

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
      if(COMMENT_INIT_SYMBOL.startsWith(this.currentChar))
      {
        this.makeComment();
        continue;
      }

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
        tokens.push(...this.makeSymbol());
        continue;
      }

      if(STARTING_DIGITS.includes(this.currentChar))
      {
        tokens.push(this.makeNumber());
        continue;
      }

      this.error(LexerErrors.ILLEGAL_CHAR, `${this.currentChar} at position ${this.currentPosition}`);
    }

    tokens.push(new Token(TokenType.END_OF_FILE, null));

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

  private makeComment(): void
  {
    this.advance();

    while(this.currentChar)
    {
      if(this.currentChar === COMMENT_STOP_SYMBOL) break;

      this.advance();
    }

    if(this.currentChar === COMMENT_STOP_SYMBOL) this.advance();
  }

  private makeIdentifier(): Token
  {
    let str: string = '';

    while(this.currentChar && CHARS.includes(this.currentChar.toLowerCase()))
    {
      str = str + this.currentChar;
      this.advance();
    }

    if(KEYWORDS.includes(str)) return new Token(TokenType.KEYWORD, str, this.getKeywordType(str));

    return new Token(TokenType.IDENTIFIER, str);
  }

  private makeString(): Token
  {
    let str: string = '';
    let closedStr: boolean = false;

    this.advance();

    while(this.currentChar)
    {
      if(this.currentChar === STRING_STOP_SYMBOL)
      {
        closedStr = true;
        break;
      }

      str = str + this.currentChar;
      this.advance();
    }

    if(!closedStr) this.error(LexerErrors.NOT_CLOSED_STRING, `At position ${this.currentPosition}`);

    if(this.currentChar === STRING_STOP_SYMBOL) this.advance();

    return new Token(TokenType.STRING, str);
  }

  private makeSymbol(): Token[]
  {
    let str: string = '';

    while(this.currentChar && SYMBOLS.includes(this.currentChar))
    {
      const filter: string[] = COMPOUND_SYMBOLS.filter(s => s.startsWith(str));

      if(filter.length === 1 && filter[0] === str) break;

      str = str + this.currentChar;

      this.advance();
    }

    if(COMPOUND_SYMBOLS.includes(str))
      return [new Token(TokenType.COMPOUND_SYMBOL, str, this.getSymbolSubType(str))];

    const tokens: Token[] = [];

    for(const symbol of str.split(''))
      tokens.push(new Token(TokenType.SYMBOL, symbol, this.getSymbolSubType(symbol)));
    
    return tokens;
  }

  private getSymbolSubType(symbol: string): string | null
  {
    switch(symbol)
    {
      case '-': return SymbolType.MINUS;
      case '+': return SymbolType.PLUS;
      case '*': return SymbolType.MULTIPLY;
      case '/': return SymbolType.DIVIDE;
      case ';': return SymbolType.SEMICOLON;
      case '{': return SymbolType.LEFT_BRACE;
      case '}': return SymbolType.RIGHT_BRACE;
      case '(': return SymbolType.LEFT_PARENTHESES;
      case ')': return SymbolType.RIGHT_PARENTHESES;
      case '"': return SymbolType.DOUBLE_QUOTES;
      case '=': return SymbolType.ATTRIBUTION;
      case '|': return SymbolType.VERTICAL_LINE;
      case '&': return SymbolType.AMPERSAND;
      case '%': return SymbolType.PERCENTAGE;
      case '!': return SymbolType.EXCLAMATION;
      case '^': return SymbolType.POWER;

      case '==': return SymbolType.EQUALS;
      case '===': return SymbolType.EXACTLY_EQUALS;
      case '!=': return SymbolType.NOT_EQUAL;
      case '<=': return SymbolType.LESS_OR_EQUALS_TO;
      case '>=': return SymbolType.MORE_OR_EQUALS_TO;
      case '||': return SymbolType.OR;
      case '&&': return SymbolType.AND;
      case '++': return SymbolType.INCREMENT;
      case '--': return SymbolType.DECREMENT;

      default: return null;
    }
  }

  private getKeywordType(keyword: string): string | null
  {
    switch(keyword)
    {
      case 'break': return KeywordType.BREAK;
      case 'return': return KeywordType.RETURN;
      case 'continue': return KeywordType.CONTINUE;
      case 'for': return KeywordType.FOR;
      case 'while': return KeywordType.WHILE;
      case 'var': return KeywordType.VAR;
      case 'const': return KeywordType.CONST;
      case 'if': return KeywordType.IF;
      case 'else': return KeywordType.ELSE;
      case 'elseif': return KeywordType.ELSEIF;
      default: return null;
    }
  }

  private error(type: string, message: string): void
  {
    throw new LexerError(type, message);
  }
}