import AutoReplace from 'slate-auto-replace'
import { Paragraph } from './Paragraph'
import { insertAfter } from '../utility/insertAdjacent'
import { flow } from '../utility/flow'

const buildReplacer = (trigger, [before, after], replace) => (
  AutoReplace({
    trigger,
    before,
    after,
    transform: typeof replace === 'function'
      ? replace
      : transform => transform.insertText(replace),
  })
)

export default [
  buildReplacer(')', [/(\(c)$/i], '©'),
  buildReplacer(')', [/(\(r)$/i], '®'),
  buildReplacer(')', [/(\(tm)$/i], '™'),
  buildReplacer('enter', [/^-{2,}$/], (transform) => {
    const paragraph = Paragraph.create()
    return flow([
      t => insertAfter(t, paragraph, t.state.startBlock),
      t => t.setBlock({ type: 'hr', isVoid: true }),
      t => t.collapseToStartOf(paragraph).moveOffsetsTo(0),
    ], transform)
  }),
  buildReplacer(' ', [/^>/, /.*$/], (t, e, data, matches) => {
    const [before] = matches.before
    const [after] = matches.after

    const replacement = after ? '' : `Blockquote`

    return t.setBlock({ type: 'blockquote' })
            .extend(-2)
            .insertText(replacement)
            .moveOffsetsTo(0, replacement.length)
  }),
  buildReplacer(' ', [/^#{1,6}/, /.*$/], (t, e, data, matches) => {
    const [before] = matches.before
    const [after] = matches.after

    const level = before.length
    const replacement = after ? '' : `Header ${level}`

    return t.setBlock({ type: 'header', data: { level } })
            .extend(-(level + 1))
            .insertText(replacement)
            .moveOffsetsTo(0, replacement.length)
  }),
]
