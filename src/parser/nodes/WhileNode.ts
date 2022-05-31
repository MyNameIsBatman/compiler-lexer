import { ParserNode } from "./ParserNode";

export class WhileNode
{
  conditionNode: ParserNode;
  body: ParserNode;

  constructor(conditionNode: ParserNode, body: ParserNode)
  {
    this.conditionNode = conditionNode;
    this.body = body;
  }

  public get representation(): string
  {
    return `While: (Condition: (${this.conditionNode.representation}), Body: (${this.body.representation}))\n`;
  }
}