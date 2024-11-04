import { Node } from './parse_token'
import { TokenType } from './tokenize.ts'

export function evaluateAst<T extends Record<string, any>>(ast: Node, data: T) {
  let result = ''

  function traverse<T extends Record<string, any>>(node: Node, data: T) {
    switch (node.type) {
      case TokenType.Text:
        result += node.content
        break

      case TokenType.Condition:
        // 根据 data 判断条件是否成立
        if (data[node.condition!]) {
          node.children!.forEach((child) => traverse(child, data))
        }
        break
      case TokenType.Loop:
        if (Array.isArray(data[node.value!]) && data[node.value!].length > 0) {
          data[node.value!].forEach((item: string) => {
            node.children!.forEach((child) =>
              traverse(child, {
                [node.itemName!]: item,
                ...data,
              })
            )
          })
        }
        break
      case TokenType.Value:
        const a = node.value!.split('.')
        let current = data
        for (let i = 0; i < a.length; i++) {
          current = current[a[i]]
        }
        result += current ?? ''
        break

      case TokenType.Wrap:
        {
          result += '\n'
        }
        break
    }
  }

  ast.children!.forEach((child) => traverse(child, data))
  return result
}
