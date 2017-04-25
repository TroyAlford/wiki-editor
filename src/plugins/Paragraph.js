import Slate from 'slate'
import { renderStyled } from '../utility/renderStyled'

export default {
  create(text) {
    const textNode = Slate.Raw.deserializeText({
      kind: 'text',
      text: text || '',
    }, { terse: true })

    return Slate.Block.create({
      type:  'paragraph',
      nodes: [textNode],
      data:  { textAlign: 'left' },
    })
  },

  schema: {
    nodes: {
      paragraph: ({ attributes, children, node }) => (
        renderStyled('p', node.data, children, attributes)
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'p') return undefined
      return {
        kind:  'block',
        type:  'paragraph',
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'paragraph') return undefined
      return renderStyled('p', object.data, children, {})
    },
  }],
}
