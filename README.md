# Text-Template 模板引擎

`template` 函数是一个自定义的模板引擎，它接收包含模板表达式的字符串，解析后返回一个函数，可以通过动态数据来渲染模板内容。

## 功能特性

- **文本插值**：从数据对象中直接插入变量值。
- **条件渲染**：根据条件动态渲染内容。
- **循环**：遍历数组，生成重复内容。
- **多余空白删除**：自动去除块内容周围的多余空格或换行符。

## 安装

npm install @dhlx/text-template

### 示例

```typescript
import { template } from '@dhlx/text-template'

const tmpl = template(`
  {{#is isLoggedIn}}
    欢迎，{{username}}！
    {{#each items for item}}
      项目: {{item}}
    {{/each}}
  {{/is}}
`)

const result = tmpl({
  isLoggedIn: true,
  username: 'Alice',
  items: ['苹果', '香蕉', '樱桃']
})

console.log(result)
// 期望输出：
// 欢迎，Alice！
// 项目: 苹果
// 项目: 香蕉
// 项目: 樱桃
```
## 使用方法
### 基本用法
template 函数接收模板字符串作为输入，并返回一个渲染函数。渲染函数接受一个数据对象，并使用数据生成最终的输出字符串。

```typescript
const renderFunction = template(templateString);
const output = renderFunction(dataObject);
```
###  支持的语法

1. 文本插值：使用 {{ 变量名 }} 语法插入变量值。

```typescript
const tmpl = template('你好，{{username}}！')
const result = tmpl({ username: 'Alice' })
// 输出："你好，Alice！"
```
2. 条件语句：使用 {{#is 条件}} ... {{/is}} 语法有条件地包含内容。
```typescript
const tmpl = template(`
  {{#is isLoggedIn}}
    欢迎，{{username}}！
  {{/is}}
`)
const result = tmpl({ isLoggedIn: true, username: 'Alice' })
// 输出："欢迎，Alice！"
```
3. 循环语句：使用 {{#each 数组名 for item名}} ... {{/each}} 语法来循环渲染数组中的内容。

```typescript
const tmpl = template(`
  {{#each items for item}}
    项目: {{item}}
  {{/each}}
`)
const result = tmpl({ items: ['苹果', '香蕉', '樱桃'] })
// 输出：
// 项目: 苹果
// 项目: 香蕉
// 项目: 樱桃
```
## 函数

`template<T extends {}>(str: string)`

* 参数
1. `str: string` - 包含文本、条件和循环的模板字符串。
* 返回值
返回一个渲染函数，该函数接收一个数据对象并返回生成的字符串。

### 示例
```typescript
const tmpl = template('你好，{{username}}！')
const result = tmpl({ username: 'Alice' })
console.log(result) // 输出："你好，Alice！"

```

## 工作原理

1. `词法分析`：将模板字符串解析为 tokens，识别文本、条件、循环和变量。
2. `AST 解析`：将 tokens 转换为抽象语法树（AST）。
3. `语法树求值`：遍历 AST 并基于数据生成内容。

## 错误处理
当以下情况发生时可能会出现错误：

* 条件或循环标签未正确嵌套。
* 数据中缺少某些引用（例如，{{username}} 未提供 username 数据）。

* 在这些情况下，evaluateAst 会跳过无效引用，但输出可能不完整。建议在传递数据前进行验证。

## 许可证
MIT License. 详见 LICENSE 文件。