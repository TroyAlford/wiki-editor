import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'

const TAGS = {
  blockquote: { kind: 'block', type: 'quote' },
  div:        { kind: 'block', type: 'div' },
  p:          { kind: 'block', type: 'paragraph' },
  span:       { kind: 'inline', type: 'span' },
}
const TAG_FOR = {
  div:       'div',
  paragraph: 'p',
  quote:     'blockquote',
  span:      'span',
}

export default {
  renderNode({ node: { type, data }, children }) {
    if (!TAG_FOR[type]) return undefined
    return renderStyled(TAG_FOR[type], { children, data })
  },

  serializers: [{
    deserialize(el, next) {
      if (!TAGS[el.tagName]) return undefined

      return {
        ...TAGS[el.tagName],
        data:  getStyleData(el),
        nodes: next(el.childNodes),
      }
    },
    serialize({ type, data }, children) {
      if (!TAG_FOR[type]) return undefined
      return renderStyled(TAG_FOR[type], { data, children })
    },
  }],
}
