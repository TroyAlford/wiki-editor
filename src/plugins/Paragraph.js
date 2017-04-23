/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import Slate from 'slate'

export default {
  create(text) {
    const textNode = Slate.Raw.deserializeText({
      kind: 'text',
      text: text || '',
    }, { terse: true })

    return Slate.Block.create({ type: 'p', nodes: [textNode] })
  },

  schema: {
    nodes: {
      paragraph: ({ attributes, children }) => <p {...attributes}>{children}</p>,
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'p') return undefined
      return {
        kind:  'block',
        type:  'p',
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'p') return undefined
      return <p>{children}</p>
    },
  }],
}
