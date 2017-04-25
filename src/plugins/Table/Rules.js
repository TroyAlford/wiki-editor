import { contains } from '../../utility/contains'

const PARENTS = {
  table: ['tr', 'thead', 'tbody', 'tfoot'],
  tr:    ['td', 'th'],
}
const PARENT_KEYS = Object.keys(PARENTS)

const CHILDREN = {
  td: ['tr'],
  th: ['tr'],
  tr: ['table', 'thead', 'tbody', 'tfoot'],
}
const CHILD_KEYS = Object.keys(CHILDREN)

const DEFAULT_PARENT = CHILD_KEYS.reduce(
  (o, key) => ({ ...o, [key]: CHILDREN[key][0] })
, {})

const wrapInvalidTableChildren = {
  match: ({ type }) => contains(PARENT_KEYS, type),

  validate: (parent) => {
    const found = parent.nodes.filter(
      child => !contains(PARENTS[parent.type] || [], child.type)
    )
    return !found.isEmpty() ? found : undefined
  },

  normalize(transform, node, children) {
    return children.reduce((t, child) => {
      const parentTag = DEFAULT_PARENT[child.type] || 'td'
      return t.wrapBlockByKey(child.key, parentTag, { normalize: false })
    }, transform)
  },
}

// const wrapInvalidTableOrphans = {
//   match:     ({ type }) => contains(CHILD_KEYS, type),
//   validate:  () => true,
//   normalize: (transform, child) => {
//     const { state } = transform
//     const parent = state.document.getParent(child.key)
//     if (contains(CHILDREN[child.type], parent.type)) return undefined

//     // this node is an orphaned table child. replace with <p>
//     return transform.setNodeByKey(child.key, { type: 'paragraph' })
//   },
// }

export default [
  wrapInvalidTableChildren,
  // wrapInvalidTableOrphans,
]
