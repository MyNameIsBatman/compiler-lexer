import { ParserNode } from './parser/nodes/ParserNode';
import { CodeBlockNode } from './parser/nodes/CodeBlockNode';
import { Lexer } from "./lexer/Lexer";
import { Token } from "./lexer/Token";
import fs from 'fs';
import path from 'path';
import { Parser } from "./parser/Parser";

const FILENAME: string = '_examples/ProfMedia.txt';

const filePath: string = path.join(__dirname, FILENAME);

fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if(!err) {
    const lexer: Lexer = new Lexer(data);
    const tokens: Token[] = lexer.findTokens();
    
    console.table(tokens);

    const parser: Parser = new Parser(tokens);
    const codeBlock: ParserNode = parser.makeCodeBlock();

    if (codeBlock != null) console.log(codeBlock.representation);
  } else {
    console.error(err);
  }
});

