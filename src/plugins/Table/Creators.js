import Slate from 'slate'
import { range } from '../../utility/range'

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
