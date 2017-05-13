import { Paragraph } from './Paragraph'
import { insertAfterAndMoveTo, insertBefore } from '../utility/insertAdjacent'

/* eslint-disable react/react-in-jsx-scope,react/prop-types */

function renderHeader(header, children) {
  const level = header.data.get('level') || 1
  const style = header.data.get('style') || {}
  const Tag = `h${level}`

  return <Tag style={style}>{children}</Tag>
}

function setHeaderLevel(state, level) {
  const transform = state.transform()
  const block = state.anchorBlock

  if (level === undefined) {
    return transform.setBlock({ type: 'paragraph', data: { level: undefined } }).apply()
  }

  if (block.type === 'header' && block.data.get('level') === level) {
    return transform.setBlock({ type: 'paragraph', data: { level: undefined } }).apply()
  }

  return transform.setBlock({ type: 'header', data: { level } }).apply()
}

function isActiveClass({ anchorBlock }, level) {
  return anchorBlock && anchorBlock.type === 'header' && anchorBlock.data.get('level') === level
}

function onDown(transform, event, state) {
  const header = state.startBlock
  const sibling = state.document.getNextSibling(header.key)
  if (sibling) return undefined

  return insertAfterAndMoveTo(transform, Paragraph.create(), header).apply()
}
function onEnter(transform, event, state) {
  const { selection } = state
  if (!selection.isCollapsed) return undefined

  const header = state.document.getClosestBlock(selection.anchorKey)

  if (selection.startOffset === 0) {
    return insertBefore(transform, Paragraph.create(), header).apply()
  }

  if (selection.endOffset === header.text.length) {
    return insertAfterAndMoveTo(transform, Paragraph.create(), header).apply()
  }

  return undefined
}

export default {
  schema: {
    nodes: {
      header: ({ node, children }) => renderHeader(node, children),
    },
  },

  serializers: [{
    deserialize(el, next) {
      const headerRegex = /h([0-6])/i
      const matches = headerRegex.exec(el.tagName)

      if (!matches) return undefined

      return {
        kind:  'block',
        type:  'header',
        data:  { level: matches[1] },
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'header') return undefined
      return renderHeader(object, children)
    },
  }],

  onKeyDown: (event, data, state) => {
    if (state.startBlock.type !== 'header') return undefined

    switch (data.key) {
      case 'enter':
        return onEnter(state.transform(), event, state)
      case 'down':
        return onDown(state.transform(), event, state)
      default:
        return undefined
    }
  },

  renderToolbar: (state, props, setState) => (
    <div className={props.toolbarButtonGroupClassName}>
      {[1, 2, 3, 4, 5, 6].map(level =>
        <button
          className={[
            props.toolbarButtonClassName,
            isActiveClass(state, level) ? 'is-active' : 'is-inactive',
          ].join(' ')}
          onClick={() => setState(setHeaderLevel(state, level))}
        >{`H${level}`}</button>
      )}
    </div>
  ),
}
