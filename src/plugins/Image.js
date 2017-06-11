import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'

export default {
  schema: {
    nodes: {
      img: ({ attributes, node }) => (
        renderStyled('img', {
          attributes: { src: node.data.get('src') },
          data: node.data,
          isVoid: true,
        })
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'img') return undefined
      return {
        kind:   'inline',
        type:   'img',
        data:   { src: el.attribs.src || '', ...getStyleData(el) },
        isVoid: true,
      }
    },
    serialize(object, children) {
      if (object.type !== 'img') return undefined
      return renderStyled('img', {
        attributes: { src: object.data.get('src') },
        data: object.data,
        isVoid: true
      })
    },
  }],
}
