import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class NumberNode extends ParserNode
{
  token: Token;

  constructor(token: Token)
  {
    super();
    this.token = token;
  }

  public getRepresentation(): string
  {
    return `Number: ${this.token.value}`;
  }
}