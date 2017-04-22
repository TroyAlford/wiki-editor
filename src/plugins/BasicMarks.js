/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import MarkHotkey from './MarkHotkey'

const MAPPINGS = [
  { hotkey: 'b', mark: 'bold', tag: 'strong' },
  { hotkey: 'd', mark: 'strike', tag: 'del' },
  { hotkey: 'i', mark: 'italic', tag: 'em' },
  { hotkey: 'u', mark: 'underline', tag: 'u' },
]

export const plugins = MAPPINGS.map(({ hotkey, mark }) => MarkHotkey({ hotkey, mark }))

const TAGS = MAPPINGS.reduce((tags, { mark, tag }) => ({ ...tags, [tag]: mark }), {})
const MARKS = MAPPINGS.reduce((marks, { tag, mark }) => ({ ...marks, [mark]: tag }), {})

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
    onClick:  state => state.transform().toggleMark(mark).apply(),
  },
], [])
