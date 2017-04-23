import { createCell, createRow, createTable } from './Creators'
import Paragraph from '../Paragraph'

function forceRange(value, lowerBound, upperBound) {
  if (value < lowerBound) return lowerBound
  if (value > upperBound) return upperBound
  return value
}

function inCellOnlyError(fnName) {
  throw new Error(`${fnName} can only be applied from within a cell`)
}

export function getTableInfo({ state }) {
  const cell = state.startBlock
  if (cell.type !== 'td') inCellOnlyError('getTableInfo')

  const row = state.document.getParent(cell.key)
  const table = state.document.getParent(row.key)
  return {
    cell,
    row,
    table,

    height: table.nodes.size,
    width:  row.nodes.size,

    x: row.nodes.findIndex(c => c === cell),
    y: table.nodes.findIndex(r => r === row),
  }
}

export function moveTo(transform, targetX, targetY) {
  const { state } = transform
  if (state.startBlock.type !== 'td') inCellOnlyError('moveTo')

  const tableInfo = getTableInfo(transform)

  const x = forceRange(targetX, 0, tableInfo.width - 1)
  const y = forceRange(targetY, 0, tableInfo.height - 1)

  const cell = tableInfo.table.nodes.get(y).nodes.get(x)

  let { startOffset } = state
  if (startOffset > cell.length) startOffset = cell.length

  return transform.collapseToEndOf(cell)
                  .moveOffsetsTo(startOffset)
}

export function insertColumn(transform, where = 'left') {
  const { x, table } = getTableInfo(transform)
  const rows = table.nodes

  const insertAt = where === 'right' ? x + 1 : x
  return rows.reduce((t, row) =>
    t.insertNodeByKey(row.key, insertAt, createCell())
  , transform)
}

export function insertRow(transform, where = 'below') {
  const { table, width, y } = getTableInfo(transform)
  const insertAt = where === 'below' ? y + 1 : y
  return transform.insertNodeByKey(table.key, insertAt, createRow(width))
}

export function insertTable(transform, columns = 2, rows = 2) {
  return transform.insertBlock(createTable(columns, rows))
}

export function removeTable(transform) {
  const { state } = transform
  if (state.startBlock.type !== 'td') inCellOnlyError('removeTable')

  const { table } = getTableInfo(transform)
  const parent = state.document.getParent(table.key)
  const index = parent.nodes.findIndex(e => e === table)

  const replacement = parent.type === 'tr'
    ? createCell()
    : Paragraph.create()

  return transform.collapseToStartOf(parent)
                  .moveOffsetsTo(0)
                  .insertNodeByKey(parent.key, index, replacement)
                  .removeNodeByKey(table.key)
}

export function deleteRow(transform) {
  const { row, height } = getTableInfo(transform)
  if (height === 1) return removeTable(transform)

  return transform.removeNodeByKey(row.key)
}

export function deleteColumn(transform) {
  const { table, x, width } = getTableInfo(transform)
  const rows = table.nodes

  if (width === 1) return removeTable(transform)

  return rows.reduce((t, row) =>
    t.removeNodeByKey(row.nodes.get(x).key)
  , transform)
}