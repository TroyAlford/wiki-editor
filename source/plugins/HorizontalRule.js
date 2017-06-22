import Slate from 'slate'
import { Paragraph } from './Paragraph'
import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'
import { insertAfterAndMoveTo, insertBefore, insertBeforeAndMoveTo } from '../utility/insertAdjacent'

function onDelete(transform, event, state) {
  const hr = state.startBlock
  let sibling = state.document.getPreviousSibling(hr.key) ||
                state.document.getNextSibling(hr.key)

  let t = transform

  if (!sibling) {
    sibling = Paragraph.create()
    t = insertBefore(t, sibling, hr)
  }

  return t.collapseToEndOf(sibling)
          .removeNodeByKey(hr.key)
          .apply()
}
function onDown(transform, event, state) {
  const hr = state.startBlock
  const sibling = state.document.getNextSibling(hr.key)
  if (sibling) return undefined

  return insertAfterAndMoveTo(transform, Paragraph.create(), hr).apply()
}
function onUp(transform, event, state) {
  const hr = state.startBlock
  const sibling = state.document.getPreviousSibling(hr.key)
  if (sibling) return undefined

  return insertBeforeAndMoveTo(transform, Paragraph.create(), hr).apply()
}

export default {
  create() {
    return Slate.Block.create({ type: 'hr' })
  },

  schema: {
    nodes: {
      hr: ({ node }) => (
        renderStyled('hr', { data: node.data })
      ),
    },
  },

  serializers: [{
    deserialize(el) {
      if (el.tagName !== 'hr') return undefined
      return {
        kind:   'block',
        type:   'hr',
        data:   getStyleData(el),
        isVoid: true,
      }
    },
    serialize(object) {
      if (object.type !== 'hr') return undefined
      return renderStyled('hr', object.data)
    },
  }],

  onKeyDown: (event, data, state) => {
    if (state.startBlock.type !== 'hr') return undefined

    switch (data.key) {
      case 'backspace':
      case 'delete':
        return onDelete(state.transform(), event, state)
      case 'down':
        return onDown(state.transform(), event, state)
      case 'up':
        return onUp(state.transform(), event, state)
      default:
        return undefined
    }
  },
}
