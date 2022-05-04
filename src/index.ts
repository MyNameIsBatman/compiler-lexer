import { Lexer } from "./models/Lexer";
import { Token } from "./models/Token";

const code: string = '{const abc=1345.65;var vfd="meu email é 1800935@escolas.anchieta.br";if(abc === 1) abc++; else abc--;}';
const lexer: Lexer = new Lexer(code);
const tokens: Token[] = lexer.findTokens();

console.log(JSON.stringify(tokens));
