import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class VariableAssignementNode extends ParserNode
{
  variableToken: Token;
  node: ParserNode;

  constructor(variableToken: Token, node: ParserNode)
  {
    super();
    this.variableToken = variableToken;
    this.node = node;
  }

  public get representation(): string
  {
    return `VariableAssignement: (${this.variableToken.value}, ${this.node.representation})`;
  }
}