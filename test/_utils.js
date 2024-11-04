export const selectFields = (tokens, fields) =>
  tokens.map((token) =>
    fields.reduce((obj, field) => {
      if (field in token) obj[field] = token[field]
      return obj
    }, {})
  )