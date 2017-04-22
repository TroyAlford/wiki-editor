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

const applyMark = (mark, state) => {
  // TODO: Expand selection to the word if there is no selection length
  return state.transform().toggleMark(mark).apply()
}

export const plugins = [{
  onKeyDown: (event, data, state) => {
    const hotkey = HOTKEYS[data.key]
    if (!event.metaKey || hotkey === undefined) return undefined

    event.preventDefault()
    return applyMark(hotkey.mark, state)
  },
}]

export const rules = [{
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
}]

export const schema = {
  marks: MAPPINGS.reduce((marks, { mark, tag: Tag }) => ({
    ...marks, [mark]: props => <Tag>{props.children}</Tag>,
  }), {}),
}

export const toolbar = MAPPINGS.reduce((all, { mark }) => [
  ...all,
  {
    mark,
    isActive: state => state.marks.some(mk => mk.type === mark),
    onClick:  state => applyMark(mark, state),
  },
], [])
