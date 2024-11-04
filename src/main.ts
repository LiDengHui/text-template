import template from '../lib/main.ts'


const tmpl = template(`
  {{#is_loggedIn}}
    欢迎，{{username}}！
    {{#each items for item}}
      项目: {{item}}
    {{/each}}
  {{/is_loggedIn}}
`)

const result = tmpl({
  is_loggedIn: true,
  username: 'Alice',
  items: ['苹果', '香蕉', '樱桃']
})

console.log(result)
