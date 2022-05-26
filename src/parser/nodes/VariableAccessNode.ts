import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class VariableAccessNode extends ParserNode
{
  variableToken: Token;

  constructor(variableToken: Token)
  {
    super();
    this.variableToken = variableToken;
  }

  public getRepresentation(): string
  {
    return `VariableAccess: ${this.variableToken.value}`;
  }
}