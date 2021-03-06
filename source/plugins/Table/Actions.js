import { createCell, createRow, createTable } from './Creators'
import { isWithinTable } from '../Table'
import { contains } from '../../utility/contains'
import { flow } from '../../utility/flow'
import Paragraph from '../Paragraph'

function forceRange(value, lowerBound, upperBound) {
  if (value < lowerBound) return lowerBound
  if (value > upperBound) return upperBound
  return value
}

function inTableOnlyError(fnName) {
  throw new Error(`${fnName} can only be applied from within a cell`)
}

export function getTableInfo({ state }) {
  if (!isWithinTable(state)) inTableOnlyError('getTableInfo')

  const doc = state.document
  const ancestors = doc.getAncestors(state.startKey).reverse()

  const table = ancestors.filter(a => a.type === 'table').get(0)
  const row = ancestors.filter(a => a.type === 'tr').get(0)
  const cell = ancestors.filter(a => contains(['td', 'th'], a.type)).get(0)

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
  if (!isWithinTable(state)) inTableOnlyError('moveTo')

  const tableInfo = getTableInfo(transform)

  const x = forceRange(targetX, 0, tableInfo.width - 1)
  const y = forceRange(targetY, 0, tableInfo.height - 1)

  let row = tableInfo.table.nodes.get(y)
  if (!row) row = tableInfo.table.nodes.get(tableInfo.y)

  let cell = row.nodes.get(x)
  if (!cell) cell = row.nodes.get(row.length - 1)
  if (!cell) return transform

  let { startOffset } = state
  if (startOffset > cell.length) startOffset = cell.length

  return transform.collapseToEndOf(cell)
}

export function insertColumn(transform, where = 'left') {
  const { x, table } = getTableInfo(transform)
  const rows = table.nodes

  const insertAt = where === 'right' ? x + 1 : x
  return rows.reduce((t, row) =>
    t.insertNodeByKey(row.key, insertAt, createCell())
  , transform) // eslint-disable-line indent
}

export function insertRow(transform, where = 'below') {
  const { table, width, y } = getTableInfo(transform)
  const insertAt = where === 'below' ? y + 1 : y
  return transform.insertNodeByKey(table.key, insertAt, createRow(width))
}

export function insertTable(transform, columns = 2, rows = 2) {
  return transform.insertBlock(createTable(columns, rows))
}

export function deleteTable(transform) {
  const { state } = transform
  if (!isWithinTable(state)) inTableOnlyError('deleteTable')

  const { table } = getTableInfo(transform)
  const parent = state.document.getParent(table.key)
  const index = parent.nodes.findIndex(e => e === table)

  const replacement = parent.type === 'tr'
    ? createCell()
    : Paragraph.create()

  /* eslint-disable indent */
  return transform.collapseToStartOf(table)
                  .moveOffsetsTo(0)
                  .insertNodeByKey(parent.key, index, replacement)
                  .removeNodeByKey(table.key)
  /* eslint-enable indent */
}

export function deleteRow(transform) {
  const { row, height, x, y } = getTableInfo(transform)
  if (height === 1) return deleteTable(transform)

  const moveToY = y < height - 1 ? y + 1 : height - 1
  return flow([
    t => moveTo(t, x, moveToY),
    t => t.removeNodeByKey(row.key),
  ], transform)
}

export function deleteColumn(transform) {
  const { table, width, x, y } = getTableInfo(transform)
  const rows = table.nodes

  if (width === 1) return deleteTable(transform)

  const moveToX = x < width - 1 ? x + 1 : width - 1
  return flow([
    t => moveTo(t, moveToX, y),
    t => rows.reduce((transformRow, row) =>
      transformRow.removeNodeByKey(row.nodes.get(x).key)
    , t), // eslint-disable-line indent

  ], transform)
}
