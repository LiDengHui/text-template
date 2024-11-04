export const enum TokenType {
  Text = 'Text',
  Condition = 'Condition',
  ConditionEnd = 'ConditionEnd',
  Loop = 'Loop',
  LoopEnd = 'LoopEnd',
  Root = 'Root',
  Value = 'Value',
  Wrap = 'Wrap',
}

export interface Token {
  type: TokenType
  start?: number
  end?: number
  itemName?: string
  value: string
  row: number
  _delete?: boolean
}

export const tokenize = (str: string) => {
  const tokens: Token[] = []
  // 正则表达式捕获条件开始、结束标记和变量标记
  const regex =
    /({{\s*#\s*each\s+(\w+)\s+for\s+(\w+)\s*}})|({{\s*\/\s*each\s*}})|({{\s*#\s*(is_\w+)\s*}})|({{\s*\/\s*(is_\w+)\s*}})|({{\s*([\w.]+)\s*}})|(\n)/g
  let lastIndex = 0
  let row = 0
  let match
  while ((match = regex.exec(str)) !== null) {
    const [
      ,
      LoopTag,
      LoopItemName,
      LoopValueName,
      LoopEndTag,
      conditionTag,
      conditionName,
      endConditionTag,
      endConditionName,
      variableTag,
      variableName,
      wrapTag,
    ] = match
    // 添加普通文本（不在条件标记或变量标记内的内容）
    if (match.index > lastIndex) {
      const value = str.slice(lastIndex, match.index)

      const token = {
        type: TokenType.Text,
        start: lastIndex,
        end: match.index - 1,
        value,
        row: row,
      }
      tokens.push(token)
    }

    if (LoopTag) {
      const token = {
        type: TokenType.Loop,
        start: lastIndex,
        end: match.index - 1,
        itemName: LoopItemName,
        value: LoopValueName,
        row,
      }
      tokens.push(token)
    }

    if (LoopEndTag) {
      tokens.push({
        type: TokenType.LoopEnd,
        value: '',
        start: match.index,
        end: regex.lastIndex,
        row: row,
      })
    }
    if (wrapTag) {
      tokens.push({
        type: TokenType.Wrap,
        value: '\n',
        start: lastIndex,
        end: match.index,
        row: row,
      })
      row += 1
    }

    // 添加条件开始标记
    if (conditionTag) {
      tokens.push({
        type: TokenType.Condition,
        value: conditionName,
        start: match.index,
        end: regex.lastIndex,
        row: row,
      })
    }

    // 添加条件结束标记
    if (endConditionTag) {
      tokens.push({
        type: TokenType.ConditionEnd,
        value: endConditionName,
        start: match.index,
        end: regex.lastIndex,
        row: row,
      })
    }

    // 添加变量标记
    if (variableTag) {
      tokens.push({
        type: TokenType.Value,
        value: variableName,
        start: match.index,
        end: regex.lastIndex,
        row: row,
      })
    }

    // 更新 lastIndex 为当前匹配结束的位置
    lastIndex = regex.lastIndex
  }

  // 添加模板末尾的普通文本
  if (lastIndex < str.length) {
    tokens.push({
      type: TokenType.Text,
      value: str.slice(lastIndex),
      start: lastIndex,
      end: str.length,
      row: row,
    })
  }

  return tokens
}
