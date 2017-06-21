import { contains } from '../../utility/contains'
import { flow } from '../../utility/flow'

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

// Rule to ensure that tables are nested TABLE > TBODY > TR > TD|TH
const enforceTableParentingRules = {
  match: ({ type }) => contains(PARENT_KEYS, type),

  validate: (parent) => {
    const found = parent.nodes.filter(
      child => !contains(PARENTS[parent.type] || [], child.type)
    )
    return !found.isEmpty() ? found : undefined
  },

  normalize(transform, node, children) {
    const doc = transform.state.document
    const ancestors = doc.getAncestors(node.key)
    const parent = ancestors.get(0)

    return flow([
      // Wrap this element, if needed, in an appropriate parent
      t => {
        if (parent && contains(CHILDREN[node.type], parent.type)) return t
        return t.wrapBlockByKey(node.key, DEFAULT_PARENT[node.type], { normalize: false })
      },

      // Wrap immediate children in the appropriate parent
      t => children.reduce((inner, child) => {
        const parentTag = DEFAULT_PARENT[child.type] || 'td'
        return inner.wrapBlockByKey(child.key, parentTag, { normalize: false })
      }, t)
    ], transform)

  },
}

// Rule to ensure that the contents of TD and TH cells are wrapped in a <p>
const wrapCellContents = {
  match: ({ type }) => contains(['th', 'td'], type),

  validate: (parent) => {
    const textNodes = parent.nodes.filter(
      child => child.kind === 'text'
    )
    return !textNodes.isEmpty() ? textNodes : undefined
  },

  normalize(transform, node, children) {
    return children.reduce((t, child) =>
      t.wrapBlockByKey(child.key, 'paragraph', { normalize: false })
    , transform)
  }
}

export default [
  wrapCellContents,
  enforceTableParentingRules,
]
