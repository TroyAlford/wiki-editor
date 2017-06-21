import Slate from 'slate'
import Paragraph from '../Paragraph'
import { range } from '../../utility/range'

export function createCell() {
  return Slate.Block.create({ type: 'td', nodes: [Paragraph.create()] })
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
