import test from 'ava'
import { TokenType, parseTokens } from '../dist/index.js'

test('parseTokens generates correct AST for simple text', (t) => {
  const tokens = [
    { type: TokenType.Text, value: 'Hello', start: 0, end: 5, row: 0 },
  ]

  const expectedAst = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Text,
        content: 'Hello',
        row: 0,
      },
    ],
    row: 0,
  }

  const result = parseTokens(tokens)
  t.deepEqual(result, expectedAst)
})

test('parseTokens handles conditions correctly', (t) => {
  const tokens = [
    {
      type: TokenType.Condition,
      value: 'isLoggedIn',
      start: 0,
      end: 14,
      row: 0,
    },
    { type: TokenType.Text, value: 'Welcome!', start: 15, end: 23, row: 1 },
    {
      type: TokenType.ConditionEnd,
      value: 'isLoggedIn',
      start: 24,
      end: 39,
      row: 2,
    },
  ]

  const expectedAst = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Condition,
        condition: 'isLoggedIn',
        children: [
          {
            type: TokenType.Text,
            content: 'Welcome!',
            row: 1,
          },
        ],
        row: 0,
      },
    ],
    row: 0,
  }

  const result = parseTokens(tokens)
  t.deepEqual(result, expectedAst)
})

test('parseTokens handles loops correctly', (t) => {
  const tokens = [
    {
      type: TokenType.Loop,
      value: 'each',
      itemName: 'item',
      start: 0,
      end: 14,
      row: 0,
    },
    { type: TokenType.Text, value: 'Item 1', start: 15, end: 21, row: 1 },
    { type: TokenType.Wrap, value: '\n', start: 22, end: 22, row: 1 },
    { type: TokenType.LoopEnd, value: 'each', start: 23, end: 37, row: 2 },
  ]

  const expectedAst = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Loop,
        value: 'each',
        itemName: 'item',
        condition: 'each',
        children: [
          {
            type: TokenType.Text,
            content: 'Item 1',
            row: 1,
          },
          {
            type: TokenType.Wrap,
            row: 1,
          },
        ],
        row: 0,
      },
    ],
    row: 0,
  }

  const result = parseTokens(tokens)
  t.deepEqual(result, expectedAst)
})

test('parseTokens throws error for mismatched condition end', (t) => {
  const tokens = [
    {
      type: TokenType.Condition,
      value: 'isLoggedIn',
      start: 0,
      end: 14,
      row: 0,
    },
    {
      type: TokenType.ConditionEnd,
      value: 'notLoggedIn',
      start: 15,
      end: 30,
      row: 1,
    },
  ]

  const error = t.throws(
    () => {
      parseTokens(tokens)
    },
    { instanceOf: Error }
  )

  t.is(
    error.message,
    'row:1: currentNode condition should be isLoggedIn, but not notLoggedIn'
  )
})
