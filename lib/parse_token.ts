import { Token, TokenType } from './tokenize.ts'

export interface Node {
  type: TokenType
  content?: string
  condition?: string
  value?: string
  children?: Node[]
  itemName?: string
  row: number
}

export function parseTokens(tokens: Token[]) {
  const ast = { type: TokenType.Root, children: [], row: 0 } as Node
  const stack: Node[] = [ast] // 栈用来跟踪当前的条件嵌套

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]
    const currentNode = stack[stack.length - 1]
    switch (token.type) {
      case TokenType.Text:
        let content = token.value
        currentNode.children!.push({
          type: TokenType.Text,
          content,
          row: token.row,
        })
        i++
        break

      case TokenType.Condition:
        const conditionNode = {
          type: TokenType.Condition,
          condition: token.value,
          children: [],
          row: token.row,
        }
        currentNode.children!.push(conditionNode)
        stack.push(conditionNode) // 开始条件块，将新节点压入栈中
        i++
        break
      case TokenType.ConditionEnd:
        {
          if (currentNode.condition !== token.value) {
            throw new Error(
              `row:${token.row}: currentNode condition should be ${currentNode.condition}, but not ${token.value}`
            )
          }
          // 当遇到条件结束标记时，弹出栈顶节点
          if (currentNode.type === TokenType.Condition) {
            stack.pop()
          }
          i++
        }
        break
      case TokenType.Loop:
        {
          const loopNode = {
            type: TokenType.Loop,
            value: token.value,
            itemName: token.itemName,
            condition: token.value,
            children: [],
            row: token.row,
          }
          currentNode.children!.push(loopNode)
          stack.push(loopNode)
          i++
        }
        break
      case TokenType.LoopEnd:
        {
          stack.pop()
          i++
        }
        break
      case TokenType.Value:
        currentNode.children!.push({
          type: TokenType.Value,
          value: token.value, // 使用 token 的值作为键
          row: token.row,
        })
        i++
        break

      case TokenType.Wrap:
        currentNode.children!.push({
          type: TokenType.Wrap,
          row: token.row,
        })
        i++
        break
    }
  }

  return ast
}
