import { ParserNode } from './nodes/ParserNode';

export class ParserResult
{
  node: ParserNode | null = null;

  public success(result: ParserResult): ParserResult
  {
    this.node = result.node;

    return this;
  }
}