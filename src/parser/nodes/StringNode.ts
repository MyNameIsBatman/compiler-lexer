import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class StringNode extends ParserNode
{
  token: Token;

  constructor(token: Token)
  {
    super();
    this.token = token;
  }

  public get representation(): string
  {
    return `String: "${this.token.value}"\n`;
  }
}