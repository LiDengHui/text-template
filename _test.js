import template from './dist/index.js'

const fn = template(`
hello
  {{#is_alert}}
  1111
  {{#is_warning}}
  12222
  {{/is_warning}}
  {{alertMessage}}
  {{/is_alert}}
  {{#each item for list}}
  {{item.name}}
  {{/each}}
  `)

console.log(
  fn({
    is_alert: true,
    is_warning: true,
    alertMessage: 'alertMessage1',
    list: [
      {
        name: 1,
      },
      {
        name: 2,
      },
    ],
  })
)
