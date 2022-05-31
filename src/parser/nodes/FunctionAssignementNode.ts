import { Token } from "../../lexer/Token";
import { ParserNode } from "./ParserNode";

export class FunctionAssignementNode extends ParserNode
{
  variableToken: Token;
  parametersTokens: Token[];
  body: ParserNode;

  constructor(variableToken: Token, parametersTokens: Token[], body: ParserNode)
  {
    super();
    this.variableToken = variableToken;
    this.parametersTokens = parametersTokens;
    this.body = body;
  }

  public get representation(): string
  {
    var paramsReps: string[] = [];

    for(const parameter of this.parametersTokens) paramsReps.push(parameter.value);
    
    return `FunctionAssignement: (${this.variableToken.value}, Parameters: (${paramsReps.join(',')}), Body: (${this.body.representation}))\n`;
  }
}