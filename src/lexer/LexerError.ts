export class LexerError
{
  name: string;
  details: string;

  constructor(name: string, details: string)
  {
    this.name = name;
    this.details = details;
  }

  public asString(): string
  {
    return ` ${this.name}: ${this.details}`;
  }
}

export class LexerErrors
{
  public static readonly ILLEGAL_CHAR: string = 'ILLEGAL_CHAR';
  public static readonly NOT_CLOSED_STRING: string = 'NOT_CLOSED_STRING';
}