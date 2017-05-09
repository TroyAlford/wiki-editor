/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import { flow } from '../utility/flow'

function findExpandedAnchors(state) {
  const anchorRegex = /\[(.+)\]\(([a-z0-9:/.+%-]+)\)/gi
  let match = anchorRegex.exec(state.document.text)

  const matches = []
  while (match !== null) {
    const text = match[1]
    const href = match[2]
    const node = state.document.getTextAtOffset(match.index)

    const anchorOffset = node.text.indexOf(match[0])
    const focusOffset = anchorOffset + match[0].length

    matches.push({
      node,
      href,
      text,
      anchorKey: node.key,
      anchorOffset,
      focusKey:  node.key,
      focusOffset,
    })

    match = anchorRegex.exec(state.document.text)
  }
  return matches
}

export default {
  schema: {
    nodes: {
      anchor: ({ node, children }) => (
        <a href={node.data.get('href') || '#'}>
          {children}
        </a>
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      if (el.tagName !== 'a') return undefined
      return {
        kind:  'inline',
        type:  'anchor',
        data:  { href: el.attribs.href || '#' },
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.type !== 'anchor') return undefined
      return <a href={object.data.get('href') || '#'}>{children}</a>
    },
  }],

  onChange: (state) => {
    const { selection } = state

    return findExpandedAnchors(state)
      .filter(anchor => (
        anchor.node.key !== selection.startKey ||
        selection.startOffset < anchor.anchorOffset ||
        selection.endOffset > anchor.focusOffset
      ))
      .reduce((inner, { text, href, node, ...selectParams }) =>
        flow([
          t => t.select(selectParams),
          t => t.insertText(text),
          t => t.extend(0 - text.length),
          t => t.wrapInlineAtRange(t.state.selection, {
            type: 'anchor', data: { href },
          }),
          (t) => {
            if (
              (selection.anchorKey !== selectParams.anchorKey) ||
              (selection.endOffset <= selectParams.focusOffset)
            ) return t.select(selection)

            // eslint-disable-next-line no-unused-vars
            const [self, next] = Array.from(t.state.document.getTextsAtRange(t.state.selection))

            const offsetAdjust =
              selectParams.anchorOffset +
              text.length + href.length + 4

            return t
              .moveToStartOf(next)
              .select({
                anchorKey:    next.key,
                anchorOffset: selection.anchorOffset - offsetAdjust,
                focusKey:     next.key,
                focusOffset:  selection.focusOffset - offsetAdjust,
              })
          },
        ], inner)
      , state.transform())
      .apply()
  },

  onSelect: (event, data, state) => {
    const anchor = state.document.getClosestInline(data.selection.anchorKey)

    // If nothing to close or open, do nothing
    if (!anchor || anchor.type !== 'anchor') return undefined

    if (anchor && anchor.type === 'anchor') {
      const href = anchor.data.get('href')
      const markdown = `[${anchor.text}](${href})`

      return flow([
        t => t.collapseToStartOf(anchor),
        t => t.removeNodeByKey(anchor.key),
        t => t.insertText(markdown),
        t => t.move(-markdown.length),
        t => t.move(1 + data.selection.startOffset),
      ], state.transform())
      .apply()
    }

    return state
  },
}
