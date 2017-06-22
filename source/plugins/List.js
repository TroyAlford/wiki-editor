import { contains } from '../utility/contains'
import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'

export default {
  schema: {
    nodes: {
      list: ({ node, children, attributes }) => {
        const type = node.data.get('listType')
        return renderStyled(type, { data: node.data, children, attributes })
      },
      li: ({ node, children, attributes }) => (
        renderStyled('li', { data: node.data, children, attributes })
      ),
    },
    rules: [{
      match: ({ type }) => type === 'list',

      validate: (parent) => {
        const hasInvalidChildren = Boolean(parent.nodes.filter(c => c.type !== 'li').size)
        return hasInvalidChildren ? parent.nodes : undefined
      },

      normalize: (transform, node, children) => (
        children.reduce((t, child) =>
          t.wrapBlockByKey(child.key, 'li', { normalize: false }),
          transform
        )
      ),
    }],
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'li') return undefined
      return {
        kind:  'block',
        type:  'li',
        data:  getStyleData(el),
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'li') return undefined
      return renderStyled('li', { data: object.data, children })
    },
  }, {
    deserialize(el, next) {
      if (!contains(['ol', 'ul'], el.tagName)) return undefined
      return {
        kind:  'block',
        type:  'list',
        data:  { listType: el.tagName, ...getStyleData(el) },
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'list') return undefined
      const type = object.data.get('listType')
      return renderStyled(type, { data: object.data, children })
    },
  }],
}
