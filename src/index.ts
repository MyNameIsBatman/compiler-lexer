import { Lexer } from "./lexer/Lexer";
import { Token } from "./lexer/Token";
import fs from 'fs';
import path from 'path';

const FILENAME: string = '_examples/SomaDoisNumeros.txt';

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

