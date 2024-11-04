import { Token, TokenType } from './tokenize.ts'

const isPreWrapOrEmptyText = (tokens: Token[], index: number = 0): boolean => {
  if (index < 1) {
    return true
  }
  const prevToken = tokens[index - 1]
  if (!prevToken) {
    return true
  } else if (prevToken.type === TokenType.Wrap) {
    return true
  } else if (
    prevToken.type === TokenType.Text &&
    prevToken.value.trim() === ''
  ) {
    return isPreWrapOrEmptyText(tokens, index - 1)
  }
  return false
}

const isNextWrapOrEmptyText = (tokens: Token[], index: number = 1): boolean => {
  const nextToken = tokens[index + 1]

  if (!nextToken) {
    return true
  } else if (nextToken.type === TokenType.Wrap) {
    return true
  } else if (
    nextToken.type === TokenType.Text &&
    nextToken.value.trim() === ''
  ) {
    return isNextWrapOrEmptyText(tokens, index + 1)
  }

  return false
}

const setDeletePreEmptyText = (tokens: Token[], index: number = 0) => {
  if (index < 0) {
    return true
  }
  const prevToken = tokens[index - 1]
  if (!prevToken) {
    return true
  } else if (prevToken.type === TokenType.Wrap) {
    return true
  } else if (
    prevToken.type === TokenType.Text &&
    prevToken.value.trim() === ''
  ) {
    prevToken._delete = true
    return setDeletePreEmptyText(tokens, index - 1)
  }
}

const setDeleteNextEmptyText = (tokens: Token[], index: number = 0) => {
  const nextToken = tokens[index + 1]
  if (!nextToken) {
    return true
  } else if (nextToken.type === TokenType.Wrap) {
    nextToken._delete = true
    return true
  } else if (
    nextToken.type === TokenType.Text &&
    nextToken.value.trim() === ''
  ) {
    nextToken._delete = true
    return setDeleteNextEmptyText(tokens, index + 1)
  }
}
export const trim_tokens = (tokens: Token[]): Token[] => {
  tokens.forEach((token, index) => {
    // 检查条件起始或结束标记
    if (
      token.type === TokenType.Condition ||
      token.type === TokenType.ConditionEnd ||
      token.type === TokenType.Loop ||
      token.type === TokenType.LoopEnd
    ) {
      // 若当前条件标记独立成行，则返回 false，将其过滤掉
      if (
        isPreWrapOrEmptyText(tokens, index) &&
        isNextWrapOrEmptyText(tokens, index)
      ) {
        setDeletePreEmptyText(tokens, index)
        setDeleteNextEmptyText(tokens, index)
      }
    }
  })

  return tokens.filter((e) => !e._delete)
}
