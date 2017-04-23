/* eslint-disable react/react-in-jsx-scope,react/prop-types */
const MAPPINGS = [
  { hotkey: 'b', mark: 'bold', tag: 'strong' },
  { hotkey: 'd', mark: 'strike', tag: 'del' },
  { hotkey: 'i', mark: 'italic', tag: 'em' },
  { hotkey: 'u', mark: 'underline', tag: 'u' },
  { hotkey: undefined, mark: 'superscript', tag: 'sup' },
  { hotkey: undefined, mark: 'subscript', tag: 'sub' },
]

const HOTKEYS = MAPPINGS.filter(m => m.hotkey).reduce(
  (all, { hotkey, ...other }) => ({ ...all, [hotkey]: other })
, {})
const MARKS = MAPPINGS.reduce(
  (marks, { tag, mark }) => ({ ...marks, [mark]: tag })
, {})
const TAGS = MAPPINGS.reduce(
  (tags, { mark, tag }) => ({ ...tags, [tag]: mark })
, {})

const findWordBoundaries = (text, position) => {
  const before = position > 0 ? text.slice(0, position) : ''
  const after = position < text.length ? text.slice(position) : ''

  const offsetLeft = before.split('')
    .reverse().join('').search(/\W/)

  const offsetRight = after.search(/\W/)

  return { offsetLeft, offsetRight }
}

const applyMark = (mark, state) => {
  const transform = state.transform()

  if (state.selection.isCollapsed) {
    const position = state.anchorOffset
    const text = (state.anchorInline || state.anchorBlock).text

    const offsets = findWordBoundaries(text, state.anchorOffset)
    return transform.moveOffsetsTo(
      offsets.offsetLeft === -1 ? 0 : position - offsets.offsetLeft,
      offsets.offsetRight === -1 ? text.length : position + offsets.offsetRight
    )
    .toggleMark(mark)
    .moveOffsetsTo(position, position)
    .apply()
  }

  return transform.toggleMark(mark).apply()
}

export default {
  onKeyDown(event, data, state) {
    const hotkey = HOTKEYS[data.key]
    if (!event.metaKey || hotkey === undefined) return undefined

    event.preventDefault()
    return applyMark(hotkey.mark, state)
  },

  schema: {
    marks: MAPPINGS.reduce((marks, { mark, tag: Tag }) => ({
      ...marks, [mark]: props => <Tag>{props.children}</Tag>,
    }), {}),
  },

  serializers: [{
    deserialize(el, next) {
      const mark = TAGS[el.tagName]
      if (!mark) return undefined
      return {
        kind:  'mark',
        type:  mark,
        nodes: next(el.children),
      }
    },
    serialize(object, children) {
      if (object.kind !== 'mark') return undefined

      const Tag = MARKS[object.type]
      if (!Tag) return undefined

      return <Tag>{children}</Tag>
    },
  }],

  toolbarButtons: MAPPINGS.reduce((all, { mark }) => [
    ...all,
    {
      icon: mark,

      isActive:  state => state.marks.some(m => m.type === mark),
      onClick:   state => applyMark(mark, state),
      isVisible: true,
    },
  ], []),
}
