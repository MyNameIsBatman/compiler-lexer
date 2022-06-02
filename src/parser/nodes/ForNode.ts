import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class ForNode
{
  identifier: Token;
  initialValue: ParserNode;
  targetValue: ParserNode;
  step: ParserNode;
  body: ParserNode;

  constructor(identifier: Token, initialValue: ParserNode, targetValue: ParserNode, step: ParserNode, body: ParserNode)
  {
    this.identifier = identifier;
    this.initialValue = initialValue;
    this.targetValue = targetValue;
    this.step = step;
    this.body = body;
  }

  public get representation(): string
  {
    return `For: (Variable: ${this.identifier.value}, Params: (${this.initialValue.representation} TO ${this.targetValue.representation} STEP ${this.step.representation}), Body: (${this.body.representation}))\n`;
  }
}