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
      type:  'div',
      nodes: [textNode],
    })
  },

  schema: {
    nodes: {
      div: ({ attributes, children, node }) => (
        renderStyled('div', { data: node.data, children, attributes })
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'div') return undefined
      return {
        kind:  'block',
        type:  'div',
        data:  getStyleData(el),
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'div') return undefined
      return renderStyled('div', object.data, children, {})
    },
  }],
}
