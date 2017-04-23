import Slate from 'slate'

const range = (start, stop) => Array.from(
  new Array((stop - start) + 1),
  (_, i) => i + start
)

export function createCell() {
  const textNode = Slate.Raw.deserializeText({
    kind: 'text',
    text: '',
  }, { terse: true })

  return Slate.Block.create({ type: 'td', nodes: [textNode] })
}
export function createRow(columns = 2) {
  return Slate.Block.create({
    type:  'tr',
    nodes: range(1, columns).map(() => createCell()),
  })
}
export function createTable(columns = 2, rows = 2) {
  return Slate.Block.create({
    type:  'table',
    nodes: range(1, rows).map(() => createRow(columns)),
  })
}
