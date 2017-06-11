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
      type:  'span',
      nodes: [textNode],
    })
  },

  schema: {
    nodes: {
      span: ({ attributes, children, node }) => (
        renderStyled('span', { data: node.data, children, attributes })
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'span') return undefined
      return {
        kind:  'inline',
        type:  'span',
        data:  getStyleData(el),
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'span') return undefined
      return renderStyled('span', { data: object.data, children })
    },
  }],
}
