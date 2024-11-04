import template from './dist/index.js'

const fn = template(`
hello
  {{#is alert}}
  1111
  {{#is warning}}
  12222
  {{/is warning}}
  {{alertMessage}}
  {{/is alert}}
  {{#each item for list}}
  {{item.name}}
  {{/each}}
  `)

console.log(
  fn({
    alert: true,
    warning: true,
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
