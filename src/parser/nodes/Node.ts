import { Token } from "../../lexer/Token";

export class ParserNode
{
  token: Token;

  constructor(token: Token)
  {
    this.token = token;
  }

  public toString(): string
  {
    return this.token.value;
  }
}