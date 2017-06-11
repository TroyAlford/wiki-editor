/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import { findWordBoundaries } from '../utility/findWordBoundaries'

const MAPPINGS = [
  { hotkey: 'b', mark: 'bold', tag: 'strong' },
  { hotkey: 'd', mark: 'strike', tag: 'del' },
  { hotkey: 'i', mark: 'italic', tag: 'em' },
  { hotkey: 'u', mark: 'underline', tag: 'u' },
  { hotkey: 'up', mark: 'superscript', tag: 'sup' },
  { hotkey: 'down', mark: 'subscript', tag: 'sub' },
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

const applyMark = (mark, state) => {
  const transform = state.transform()

  if (state.selection.isCollapsed) {
    const text = state.anchorText.text
    const position = state.anchorOffset
    const { offsetLeft, offsetRight } = findWordBoundaries(text, position)

    const endOfWord = (offsetRight <= 0)
    if (!endOfWord) {
      return transform.moveOffsetsTo(
        offsetLeft === -1 ? 0 : position - offsetLeft,
        offsetRight === -1 ? text.length : position + offsetRight
      )
      .toggleMark(mark)
      .moveOffsetsTo(position, position)
      .apply()
    }
  }

  return transform.toggleMark(mark).apply()
}

const isActive = (state, mark) => state.marks.some(m => m.type === mark)

export default {
  onKeyDown(event, data, state) {
    const hotkey = HOTKEYS[data.key]
    if (!(event.metaKey || event.ctrlKey) || hotkey === undefined) { return undefined }

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
      const Tag = MARKS[object.type]
      if (!Tag) return undefined

      return <Tag>{children}</Tag>
    },
  }],

  renderToolbar: (state, props, setState) => (
    <div className={props.toolbarButtonGroupClassName}>
      {MAPPINGS.map(({ mark }) => {
        const className = [
          props.toolbarButtonClassName,
          isActive(state, mark) ? 'is-active' : 'is-inactive',
          `icon icon-${mark}`,
        ].join(' ')

        const onMouseDown = (event) => {
          event.preventDefault()
          setState(applyMark(mark, state))
        }

        return <button key={mark} className={className} onMouseDown={onMouseDown} />
      })}
    </div>
  ),
}
