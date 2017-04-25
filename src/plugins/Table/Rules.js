import { contains } from '../../utility/contains'

const VALID_CHILDREN = {
  table: ['tr', 'thead', 'tbody', 'tfoot'],
  tr:    ['td', 'th'],
}
const VALID_PARENTS = {
  td: ['tr'],
  th: ['tr'],
  tr: ['table', 'thead', 'tbody', 'tfoot'],
}
const DEFAULT_PARENT = Object.keys(VALID_PARENTS).reduce(
  (o, key) => ({ ...o, [key]: VALID_PARENTS[key][0] })
, {})

const wrapInvalidTableChildren = {
  match: ({ type }) => contains(Object.keys(VALID_CHILDREN), type),

  validate: (parent) => {
    const found = parent.nodes.filter(
      child => !contains(VALID_CHILDREN[parent.type] || [], child.type)
    )
    return !found.isEmpty() ? found : null
  },

  normalize(transform, node, children) {
    return children.reduce((t, child) => {
      const parentTag = DEFAULT_PARENT[child.type] || 'td'
      return t.wrapBlockByKey(child.key, parentTag)
    }, transform)
  },
}

export default [
  wrapInvalidTableChildren,
]
