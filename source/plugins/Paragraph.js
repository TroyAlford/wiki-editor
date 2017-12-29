import { Block, Raw } from 'slate'
import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'

export default {
  create(text) {
    const textNode = Raw.deserializeText({
      kind: 'text',
      text: text || '',
    }, { terse: true })

    return Block.create({
      type:  'paragraph',
      nodes: [textNode],
    })
  },

  renderNode({ node, children }) {
    if (node.type === 'paragraph') return undefined
    return renderStyled('p', { children, data: node.data })
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'p') return undefined
      return {
        kind:  'block',
        type:  'paragraph',
        data:  getStyleData(el),
        nodes: next(el.children),
      }
    },
    serialize({ type, data }, children) {
      if (type !== 'paragraph') return undefined
      return renderStyled('p', { data, children })
    },
  }],
}
