import { ParserNode } from "./ParserNode";

export class CallingNode extends ParserNode
{
  identifierNode: ParserNode;
  argumentsNodes: ParserNode[];

  constructor(identifierNode: ParserNode, argumentsNodes: ParserNode[])
  {
    super();
    this.identifierNode = identifierNode;
    this.argumentsNodes = argumentsNodes;
  }

  public get representation(): string
  {
    var argumentsReps: string[] = [];

    for(const argument of this.argumentsNodes) argumentsReps.push(argument.representation);

    return `Call: ${this.identifierNode.representation}(${argumentsReps.join(',')})`;
  }
}