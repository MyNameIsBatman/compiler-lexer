import { Token } from "../../lexer/Token";
import { ParserNode } from "./Node";

export class BinaryOperationNode
{
  leftNode: ParserNode;
  operationToken: Token;
  rightNode: ParserNode;

  public toString(): string
  {
    return `(${this.leftNode.toString()}, ${this.operationToken.value}, ${this.rightNode.toString()})`;
  }
}