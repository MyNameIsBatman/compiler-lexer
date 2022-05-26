import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class BinaryOperationNode extends ParserNode
{
  leftNode: ParserNode;
  operationToken: Token;
  rightNode: ParserNode;

  constructor(leftNode: ParserNode, operationToken: Token, rightNode: ParserNode)
  {
    super();
    this.leftNode = leftNode;
    this.operationToken = operationToken;
    this.rightNode = rightNode;
  }

  public getRepresentation(): string
  {
    return `BinaryOperation: (${this.leftNode.getRepresentation()}, ${this.operationToken.value}, ${this.rightNode.getRepresentation()})`;
  }
}