import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class UnaryOperationNode extends ParserNode
{
  operationToken: Token;
  node: ParserNode;

  constructor(operationToken: Token, node: ParserNode)
  {
    super();
    this.operationToken = operationToken;
    this.node = node;
  }

  public getRepresentation(): string
  {
    return `UnaryOperation: (${this.operationToken.value}, ${this.node.getRepresentation()})`;
  }
}