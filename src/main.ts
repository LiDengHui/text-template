import template from '../lib/main.ts'


const fn = template(`
  hello
  {{# is alert}}
  1111 
  {{# is warning}}
  2222
  {{/ is warning}}
  {{/is alert}}
`);

console.log(fn({
    id: '4',
    success_count: 20,
    total_count: 77796,
    current_status: 0.03,
    error_budget: -72.36,
    burn_rate: 1.72,
    status: 'Alert'
  }
))