import test from 'ava'
import { trim_tokens, TokenType } from '../dist/index.js'
import { selectFields } from './_utils.js'

test('trim_tokens removes empty text and wrap tokens around condition tokens', (t) => {
  const tokens = [
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Text, value: '   ', row: 1 },
    { type: TokenType.Condition, value: 'alert', row: 1 },
    { type: TokenType.Wrap, value: '\n', row: 2 },
    { type: TokenType.Text, value: '  content  ', row: 3 },
    { type: TokenType.Wrap, value: '\n', row: 3 },
    { type: TokenType.ConditionEnd, value: 'alert', row: 4 },
    { type: TokenType.Wrap, value: '\n', row: 5 },
  ]

  const expectedTokens = [
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Condition, value: 'alert', row: 1 },
    { type: TokenType.Text, value: '  content  ', row: 3 },
    { type: TokenType.Wrap, value: '\n', row: 3 },
    { type: TokenType.ConditionEnd, value: 'alert', row: 4 },
  ]

  const result = trim_tokens(tokens)

  t.deepEqual(selectFields(result, ['type', 'value', 'row']), expectedTokens)
})

test('trim_tokens keeps standalone text tokens without trimming', (t) => {
  const tokens = [
    { type: TokenType.Text, value: 'Hello', row: 0 },
    { type: TokenType.Wrap, value: '\n', row: 1 },
    { type: TokenType.Text, value: 'world', row: 1 },
  ]

  const expectedTokens = [
    { type: TokenType.Text, value: 'Hello', row: 0 },
    { type: TokenType.Wrap, value: '\n', row: 1 },
    { type: TokenType.Text, value: 'world', row: 1 },
  ]

  const result = trim_tokens(tokens)

  t.deepEqual(selectFields(result, ['type', 'value', 'row']), expectedTokens)
})

test('trim_tokens removes empty text tokens around loop tokens', (t) => {
  const tokens = [
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Text, value: ' ', row: 1 },
    { type: TokenType.Loop, value: 'items', row: 1 },
    { type: TokenType.Wrap, value: '\n', row: 2 },
    { type: TokenType.Text, value: 'item', row: 3 },
    { type: TokenType.Wrap, value: '\n', row: 3 },
    { type: TokenType.LoopEnd, value: 'items', row: 4 },
    { type: TokenType.Wrap, value: '\n', row: 5 },
  ]

  const expectedTokens = [
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Loop, value: 'items', row: 1 },
    { type: TokenType.Text, value: 'item', row: 3 },
    { type: TokenType.Wrap, value: '\n', row: 3 },
    { type: TokenType.LoopEnd, value: 'items', row: 4 },
  ]

  const result = trim_tokens(tokens)

  t.deepEqual(selectFields(result, ['type', 'value', 'row']), expectedTokens)
})
