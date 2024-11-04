import test from 'ava'
import { TokenType, evaluateAst } from '../dist/index.js'

test('evaluateAst processes text nodes correctly', (t) => {
  const ast = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Text,
        content: 'Hello, ',
        row: 0,
      },
      {
        type: TokenType.Text,
        content: 'World!',
        row: 1,
      },
    ],
    row: 0,
  }

  const result = evaluateAst(ast, {})
  t.is(result, 'Hello, World!')
})

test('evaluateAst evaluates condition nodes correctly', (t) => {
  const ast = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Condition,
        condition: 'isLoggedIn',
        children: [
          {
            type: TokenType.Text,
            content: 'Welcome back!',
            row: 0,
          },
        ],
        row: 0,
      },
    ],
    row: 0,
  }

  const data = { isLoggedIn: true }
  const resultTrue = evaluateAst(ast, data)
  t.is(resultTrue, 'Welcome back!')

  const dataFalse = { isLoggedIn: false }
  const resultFalse = evaluateAst(ast, dataFalse)
  t.is(resultFalse, '')
})

test('evaluateAst processes loop nodes correctly', (t) => {
  const ast = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Loop,
        value: 'items',
        itemName: 'item',
        condition: 'items',
        children: [
          {
            type: TokenType.Text,
            content: 'Item: ',
            row: 0,
          },
          {
            type: TokenType.Value,
            value: 'item',
            row: 1,
          },
          {
            type: TokenType.Wrap,
            row: 2,
          },
        ],
        row: 0,
      },
    ],
    row: 0,
  }

  const data = {
    items: ['Apple', 'Banana', 'Cherry'],
  }

  const result = evaluateAst(ast, data)
  t.is(result, 'Item: Apple\nItem: Banana\nItem: Cherry\n')
})

test('evaluateAst handles nested conditions and loops', (t) => {
  const ast = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Condition,
        condition: 'showGreeting',
        children: [
          {
            type: TokenType.Text,
            content: 'Hello ',
            row: 0,
          },
          {
            type: TokenType.Value,
            value: 'username',
            row: 1,
          },
        ],
        row: 0,
      },
      {
        type: TokenType.Loop,
        value: 'tasks',
        itemName: 'task',
        children: [
          {
            type: TokenType.Text,
            content: 'Task: ',
            row: 2,
          },
          {
            type: TokenType.Value,
            value: 'task',
            row: 3,
          },
          {
            type: TokenType.Wrap,
            row: 4,
          },
        ],
        row: 1,
      },
    ],
    row: 0,
  }

  const data = {
    showGreeting: true,
    username: 'Alice',
    tasks: ['Task 1', 'Task 2'],
  }

  const result = evaluateAst(ast, data);
  console.log(result)
  t.is(result, 'Hello AliceTask: Task 1\nTask: Task 2\n')
})

test('evaluateAst returns empty for missing values', (t) => {
  const ast = {
    type: TokenType.Root,
    children: [
      {
        type: TokenType.Value,
        value: 'nonExistentKey',
        row: 0,
      },
    ],
    row: 0,
  }

  const result = evaluateAst(ast, {})
  t.is(result, '')
})
