import AutoReplace from 'slate-auto-replace'

const buildReplacer = (trigger, before, replace) => (
  AutoReplace({
    trigger,
    before,
    transform: typeof replace === 'function'
      ? replace
      : transform => transform.insertText(replace),
  })
)

export default [
  buildReplacer(')', /(\(c)$/i, '©'),
  buildReplacer(')', /(\(r)$/i, '®'),
  buildReplacer(')', /(\(tm)$/i, '™'),
  buildReplacer('enter', /^-{2,}$/, t =>
    t.setBlock({ type: 'hr', isVoid: true })
  ),
]
