export class Token
{
  type: string;
  value: any;
  subType?: string | null;

  constructor(type: string, value: any, subType?: string | null)
  {
    this.type = type;
    this.value = value;
    this.subType = subType || null;
  }
}

export class TokenType
{
  public static readonly SYMBOL: string = 'SYMBOL';
  public static readonly COMPOUND_SYMBOL: string = 'COMPOUND_SYMBOL';
  public static readonly KEYWORD: string = 'KEYWORD';
  public static readonly INTEGER: string = 'INTEGER';
  public static readonly FLOAT: string = 'FLOAT';
  public static readonly STRING: string = 'STRING';
  public static readonly IDENTIFIER: string = 'IDENTIFIER';
}

export class SymbolType
{
  public static readonly MINUS: string = 'SYMBOL_MINUS';
  public static readonly PLUS: string = 'SYMBOL_PLUS';
  public static readonly MULTIPLY: string = 'SYMBOL_MULTIPLY';
  public static readonly DIVIDE: string = 'SYMBOL_DIVIDE';
  public static readonly SEMICOLON: string = 'SYMBOL_SEMICOLON';
  public static readonly LEFT_BRACE: string = 'SYMBOL_LEFT_BRACE';
  public static readonly RIGHT_BRACE: string = 'SYMBOL_RIGHT_BRACE';
  public static readonly LEFT_PARENTHESES: string = 'SYMBOL_LEFT_PARENTHESES';
  public static readonly RIGHT_PARENTHESES: string = 'SYMBOL_RIGHT_PARENTHESES';
  public static readonly DOUBLE_QUOTES: string = 'SYMBOL_DOUBLE_QUOTES';
  public static readonly ATTRIBUTION: string = 'SYMBOL_ATTRIBUTION';
  public static readonly VERTICAL_LINE: string = 'SYMBOL_VERTICAL_LINE';
  public static readonly AMPERSAND: string = 'SYMBOL_AMPERSAND';
  public static readonly PERCENTAGE: string = 'SYMBOL_PERCENTAGE';
  public static readonly EXCLAMATION: string = 'SYMBOL_EXCLAMATION';

  public static readonly EQUALS: string = 'SYMBOL_EQUALS';
  public static readonly NOT_EQUALS: string = 'SYMBOL_NOT_EQUALS';
  public static readonly LESS_OR_EQUALS_TO: string = 'SYMBOL_LESS_OR_EQUALS_TO';
  public static readonly MORE_OR_EQUALS_TO: string = 'SYMBOL_MORE_OR_EQUALS_TO';
  public static readonly OR: string = 'SYMBOL_OR';
  public static readonly AND: string = 'SYMBOL_AND';
  public static readonly INCREMENT: string = 'SYMBOL_INCREMENT';
  public static readonly DECREMENT: string = 'SYMBOL_DECREMENT';
}

export class KeywordType
{
  public static readonly BREAK: string = 'KEYWORD_BREAK';
  public static readonly RETURN: string = 'KEYWORD_RETURN';
  public static readonly CONTINUE: string = 'KEYWORD_CONTINUE';
  public static readonly FOR: string = 'KEYWORD_FOR';
  public static readonly WHILE: string = 'KEYWORD_WHILE';
  public static readonly VAR: string = 'KEYWORD_VAR';
  public static readonly CONST: string = 'KEYWORD_CONST';
  public static readonly IF: string = 'KEYWORD_IF';
  public static readonly ELSE: string = 'KEYWORD_ELSE';
  public static readonly ELSEIF: string = 'KEYWORD_ELSEIF';
}