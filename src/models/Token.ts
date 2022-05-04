export class Token
{
  type: string;
  value: any;
  subType?: string;

  constructor(type: string, value: any, subType?: string)
  {
    this.type = type;
    this.value = value;
    this.subType = subType;
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
  public static readonly MINUS: string = 'MINUS';
  public static readonly PLUS: string = 'PLUS';
  public static readonly MULTIPLY: string = 'MULTIPLY';
  public static readonly DIVIDE: string = 'DIVIDE';
  public static readonly SEMICOLON: string = 'SEMICOLON';
  public static readonly LEFT_BRACE: string = 'LEFT_BRACE';
  public static readonly RIGHT_BRACE: string = 'RIGHT_BRACE';
  public static readonly LEFT_PARENTHESES: string = 'LEFT_PARENTHESES';
  public static readonly RIGHT_PARENTHESES: string = 'RIGHT_PARENTHESES';
  public static readonly DOUBLE_QUOTES: string = 'DOUBLE_QUOTES';
  public static readonly EQUALS: string = 'EQUALS';
}