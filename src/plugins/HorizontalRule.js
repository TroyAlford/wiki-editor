import Slate from 'slate'
import Paragraph from './Paragraph'
import { renderStyled } from '../utility/renderStyled'

function onDelete(transform, event, state) {
  const hr = state.startBlock
  let sibling = state.document.getPreviousSibling(hr.key) ||
                state.document.getNextSibling(hr.key)

  let t = transform

  if (!sibling) {
    const parent = state.document.getParent(hr.key)
    const index = parent.nodes.findIndex(n => n === hr)
    sibling = Paragraph.create()
    t = t.insertNodeByKey(parent.key, index, sibling)
  }

  return t.collapseToStartOf(sibling)
          .moveOffsetsTo(0)
          .removeNodeByKey(hr.key)
          .apply()
}
function onDown(transform, event, state) {
  const hr = state.startBlock
  let sibling = state.document.getNextSibling(hr.key)
  if (sibling) return undefined

  const parent = state.document.getParent(hr.key)
  const hrIndex = parent.nodes.findIndex(n => n === hr)

  sibling = Paragraph.create()
  return transform.insertNodeByKey(parent.key, hrIndex + 1, sibling)
                  .collapseToStartOf(sibling)
                  .moveOffsetsTo(0)
                  .apply()
}
function onUp(transform, event, state) {
  const hr = state.startBlock
  let sibling = state.document.getPreviousSibling(hr.key)
  if (sibling) return undefined

  const parent = state.document.getParent(hr.key)
  const hrIndex = parent.nodes.findIndex(n => n === hr)

  sibling = Paragraph.create()
  return transform.insertNodeByKey(parent.key, hrIndex, sibling)
                  .collapseToStartOf(sibling)
                  .moveOffsetsTo(0)
                  .apply()
}

export default {
  create() {
    return Slate.Block.create({ type: 'hr' })
  },

  schema: {
    nodes: {
      hr: ({ node }) => (
        renderStyled('hr', node.data)
      ),
    },
  },

  serializers: [{
    deserialize(el) {
      if (el.tagName !== 'hr') return undefined
      return {
        kind:   'block',
        type:   'hr',
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
