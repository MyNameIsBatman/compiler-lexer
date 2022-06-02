import { ParserNode } from "./ParserNode";

export class IfCase
{
  conditionNode: ParserNode;
  expressionNode: ParserNode;

  constructor(conditionNode: ParserNode, expressionNode: ParserNode)
  {
    this.conditionNode = conditionNode;
    this.expressionNode = expressionNode;
  }

  public get representation(): string
  {
    return `Case: Condition: (${this.conditionNode.representation}), Expression: (${this.expressionNode.representation})\n`;
  }
}