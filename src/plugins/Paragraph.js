/* eslint-disable react/react-in-jsx-scope,react/prop-types */

export default {
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
