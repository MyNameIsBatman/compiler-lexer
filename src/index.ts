import { Lexer } from "./models/Lexer";
import { Token } from "./models/Token";
import fs from 'fs';
import path from 'path';

const FILENAME: string = 'examples/teste.txt';

const filePath: string = path.join(__dirname, FILENAME);

fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if(!err) {
    const lexer: Lexer = new Lexer(data);
    const tokens: Token[] = lexer.findTokens();
    
    console.table(tokens);
  } else {
    console.error(err);
  }
});

