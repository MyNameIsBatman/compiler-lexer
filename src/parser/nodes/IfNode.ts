import { IfCase } from './IfCase';
import { ParserNode } from "./ParserNode";

export class IfNode extends ParserNode
{
  cases: IfCase[];
  elseCase: ParserNode | null;

  constructor(cases: IfCase[], elseCase: ParserNode | null)
  {
    super();
    this.cases = cases;
    this.elseCase = elseCase;
  }

  public get representation(): string
  {
    var casesReps: string[] = [];

    for(const casex of this.cases) casesReps.push(casex.representation);

    return `If: (${casesReps.join(',')}, Else: (${this.elseCase ? this.elseCase.representation : 'None'}))\n`;
  }
}