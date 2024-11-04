import { tokenize, TokenType } from './tokenize.ts'
import type { Token } from './tokenize.ts'
import { parseTokens } from './parse_token.ts'
import type { Node } from './parse_token.ts'
import { evaluateAst } from './evaluate_ast.ts'
import { trim_tokens } from './trim_tokens.ts'

function template<T extends {}>(str: string) {
  let tokens = tokenize(str)
  tokens = trim_tokens(tokens)
  let ast = parseTokens(tokens)
  return (data: T) => {
    return evaluateAst(ast, data)
  }
}

export {
  Token,
  Node,
  tokenize,
  parseTokens,
  evaluateAst,
  trim_tokens,
  TokenType,
}
export default template
