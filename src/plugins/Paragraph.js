import { Block, Raw } from 'slate'
import { renderStyled } from '../utility/renderStyled'

export const Paragraph = {
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

export default Paragraph
