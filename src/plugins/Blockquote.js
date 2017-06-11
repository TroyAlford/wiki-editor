import { Block, Raw } from 'slate'
import { renderStyled } from '../utility/renderStyled'

export default {
  schema: {
    nodes: {
      blockquote: ({ attributes, children, node }) => (
        renderStyled('blockquote', node.data, children, attributes)
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'blockquote') return undefined
      return {
        kind:  'block',
        type:  'blockquote',
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'blockquote') return undefined
      return renderStyled('blockquote', object.data, children, {})
    },
  }],
}
