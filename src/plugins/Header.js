/* eslint-disable react/react-in-jsx-scope,react/prop-types */
function renderHeader(header, children) {
  const level = header.data.get('level') || 1
  const style = header.data.get('style') || {}
  const Tag = `h${level}`

  return <Tag style={style}>{children}</Tag>
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

  // onChange: (state) => {
  //   const { selection } = state

  //   return findExpandedAnchors(state)
  //     .filter(anchor => (
  //       anchor.node.key !== selection.startKey ||
  //       selection.startOffset < anchor.anchorOffset ||
  //       selection.endOffset > anchor.focusOffset
  //     ))
  //     .reduce((inner, { text, href, node, ...selectParams }) =>
  //       flow([
  //         t => t.select(selectParams),
  //         t => t.insertText(text),
  //         t => t.extend(0 - text.length),
  //         t => t.wrapInlineAtRange(t.state.selection, {
  //           type: 'anchor', data: { href },
  //         }),
  //         (t) => {
  //           if (
  //             (selection.anchorKey !== selectParams.anchorKey) ||
  //             (selection.endOffset <= selectParams.focusOffset)
  //           ) return t.select(selection)

  //           // eslint-disable-next-line no-unused-vars
  //           const [self, next] = Array.from(t.state.document.getTextsAtRange(t.state.selection))

  //           const offsetAdjust =
  //             selectParams.anchorOffset +
  //             text.length + href.length + 4

  //           return t
  //             .moveToStartOf(next)
  //             .select({
  //               anchorKey:    next.key,
  //               anchorOffset: selection.anchorOffset - offsetAdjust,
  //               focusKey:     next.key,
  //               focusOffset:  selection.focusOffset - offsetAdjust,
  //             })
  //         },
  //       ], inner)
  //     , state.transform())
  //     .apply()
  // },

  // onSelect: (event, data, state) => {
  //   const anchor = state.document.getClosestInline(data.selection.anchorKey)

  //   // If nothing to close or open, do nothing
  //   if (!anchor || anchor.type !== 'anchor') return undefined

  //   if (anchor && anchor.type === 'anchor') {
  //     const href = anchor.data.get('href')
  //     const markdown = `[${anchor.text}](${href})`

  //     return flow([
  //       t => t.collapseToStartOf(anchor),
  //       t => t.removeNodeByKey(anchor.key),
  //       t => t.insertText(markdown),
  //       t => t.move(-markdown.length),
  //       t => t.move(1 + data.selection.startOffset),
  //     ], state.transform())
  //     .apply()
  //   }

  //   return state
  // },
}
