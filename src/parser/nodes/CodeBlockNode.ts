import { ParserNode } from "./ParserNode";

export class CodeBlockNode extends ParserNode
{
  expressions: ParserNode[];

  constructor(expressions: ParserNode[])
  {
    super();
    this.expressions = expressions;
  }

  public get representation(): string
  {
    const expressionsReps: string[] = [];

    for (const expression of this.expressions) expressionsReps.push(expression.representation);

    return `CodeBlock: (${expressionsReps.join(',')})\n`;
  }
}