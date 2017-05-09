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
  buildReplacer(' ', /^#{1,6}/, (t, e, data, matches) => {
    const [hashes] = matches.before
    const level = hashes.length
    const replacement = `Header ${level}`

    return t.setBlock({ type: 'header', data: { level } })
            .extend(-(level + 1))
            .insertText(replacement)
            .moveOffsetsTo(0, replacement.length)
  }),
]
