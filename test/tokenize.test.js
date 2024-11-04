import test from 'ava'
import { tokenize, TokenType } from '../dist/index.js'
import { selectFields } from './_utils.js'

// 测试文本和条件标记的解析
test('tokenize should parse simple text and condition tokens', (t) => {
  const template = 'Hello, {{# is_alert}}world{{/ is_alert}}!'
  const tokens = tokenize(template)

  t.deepEqual(selectFields(tokens, ['type', 'value', 'row']), [
    { type: TokenType.Text, value: 'Hello, ', row: 0 },
    { type: TokenType.Condition, value: 'is_alert', row: 0 },
    { type: TokenType.Text, value: 'world', row: 0 },
    {
      type: TokenType.ConditionEnd,
      value: 'is_alert',
      row: 0,
    },
    { type: TokenType.Text, value: '!', row: 0 },
  ])
})

// 测试循环标记的解析
test('tokenize should parse loop tokens', (t) => {
  const template = '{{# each items for item}}\n  Item: {{item}}\n{{/ each}}'
  const tokens = tokenize(template)

  t.deepEqual(selectFields(tokens, ['type', 'value', 'row', 'itemName']), [
    {
      type: TokenType.Loop,
      value: 'item',
      itemName: 'items',
      row: 0,
    },
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Text, value: '  Item: ', row: 1 },
    { type: TokenType.Value, value: 'item', row: 1 },
    { type: TokenType.Wrap, value: '\n', row: 1 },
    { type: TokenType.LoopEnd, value: '', row: 2 },
  ])
})

// 测试多行文本和换行标记的解析
test('tokenize should parse multiline text with wrap tokens', (t) => {
  const template =
    'Line 1\nLine 2\n{{# is_show}}Visible Text{{/ is_show}}\nLine 4'
  const tokens = tokenize(template)

  t.deepEqual(selectFields(tokens, ['type', 'value', 'row']), [
    { type: TokenType.Text, value: 'Line 1', row: 0 },
    { type: TokenType.Wrap, value: '\n', row: 0 },
    { type: TokenType.Text, value: 'Line 2', row: 1 },
    { type: TokenType.Wrap, value: '\n', row: 1 },
    { type: TokenType.Condition, value: 'is_show', row: 2 },
    { type: TokenType.Text, value: 'Visible Text', row: 2 },
    { type: TokenType.ConditionEnd, value: 'is_show', row: 2 },
    { type: TokenType.Wrap, value: '\n', row: 2 },
    { type: TokenType.Text, value: 'Line 4', row: 3 },
  ])
})

// 测试变量标记的解析
test('tokenize should parse variable tokens', (t) => {
  const template = 'Hello, {{name}}!'
  const tokens = tokenize(template)

  t.deepEqual(selectFields(tokens, ['type', 'value', 'row']), [
    { type: TokenType.Text, value: 'Hello, ', row: 0 },
    { type: TokenType.Value, value: 'name', row: 0 },
    { type: TokenType.Text, value: '!', row: 0 },
  ])
})

// 测试复杂模板的解析
test('tokenize should parse complex templates with mixed tokens', (t) => {
  const template = `
{{# each items for item}}
  {{# is_alert}}Item: {{item}}{{/ is_alert}}
{{/ each}}
`
  const tokens = tokenize(template)

  t.deepEqual(selectFields(tokens, ['type', 'value', 'row', 'itemName']), [
    { type: TokenType.Wrap, value: '\n', row: 0 },
    {
      type: TokenType.Loop,
      value: 'item',
      itemName: 'items',
      row: 1,
    },
    { type: TokenType.Wrap, value: '\n', row: 1 },
    { type: TokenType.Text, value: '  ', row: 2 },
    { type: TokenType.Condition, value: 'is_alert', row: 2 },
    { type: TokenType.Text, value: 'Item: ', row: 2 },
    { type: TokenType.Value, value: 'item', row: 2 },
    {
      type: TokenType.ConditionEnd,
      value: 'is_alert',
      row: 2,
    },
    { type: TokenType.Wrap, value: '\n', row: 2 },
    { type: TokenType.LoopEnd, value: '', row: 3 },
    { type: TokenType.Wrap, value: '\n', row: 3 },
  ])
})
