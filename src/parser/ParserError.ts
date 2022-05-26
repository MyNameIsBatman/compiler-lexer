export class ParserError
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
    return `[PARSER] ${this.name}: ${this.details}`;
  }
}

export class ParserErrors
{
  public static readonly TOKEN_EXPECTED: string = 'TOKEN_EXPECTED';
}