import { createCell, createRow, createTable } from './Creators'
import Paragraph from '../Paragraph'

function flow(functions, value) {
  return functions.reduce((sum, fn) => fn(sum), value)
}

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

export function insertColumn(transform) {
  const { x, table } = getTableInfo(transform)
  const rows = table.nodes

  return rows.reduce((t, row) =>
    t.insertNodeByKey(row.key, x, createCell())
  , transform)
}

export function insertRow(transform) {
  const { table, width, y } = getTableInfo(transform)
  return transform.insertNodeByKey(table.key, y, createRow(width))
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

export function removeRow(transform) {
  const { row, height } = getTableInfo(transform)
  if (height === 1) return removeTable(transform)

  return transform.removeNodeByKey(row.key)
}

export function removeColumn(transform) {
  const { table, x, width } = getTableInfo(transform)
  const rows = table.nodes

  if (width === 1) return removeTable(transform)

  return rows.reduce((t, row) =>
    t.removeNodeByKey(row.nodes.get(x).key)
  , transform)
}

 // setColumnAlign: (transform, setTo) => {
 //    const { columnIndex, table } = getPosition(transform)
 //    const align = table.data.get('align')
 //    align.splice(columnIndex, 1, setTo)

 //    let t = transform.setNodeByKey(table.key, { data: { align } })
 //    table.nodes.forEach((row) => {
 //      const cell = row.nodes.get(columnIndex)
 //      t = t.setNodeByKey(cell.key, { data: { align: setTo } })
 //    })

 //    return t
 //  },

 //  removeColumn: (transform) => {
 //    const { moveSelectionBy } = plugin.transforms
 //    const { columnCount, columnIndex, table } = getPosition(transform)

 //    let moveBy = 0
 //    if (columnCount > 1 && columnIndex === 0) {
 //      moveBy = 1
 //    } else if (columnCount > 1 && columnIndex === columnCount - 1) {
 //      moveBy = -1
 //    }

 //    const rows = table.nodes

 //    let t = moveSelectionBy(transform, moveBy, 0)
 //    if (columnCount > 1) {
 //      rows.forEach((row) => {
 //        const cell = row.nodes.get(columnIndex)
 //        t = t.removeNodeByKey(cell.key)
 //      })

 //      const align = table.data.get('align')
 //      align.splice(columnIndex, 1)
 //      t = t.setNodeByKey(table.key, { data: { align } })
 //    } else {
 //      rows.forEach((row) => {
 //        row.nodes.forEach((cell) => {
 //          cell.nodes.forEach((node) => {
 //            t = t.removeNodeByKey(node.key)
 //          })
 //        })
 //      })
 //    }

 //    return t
 //  },

 //  removeRow: (transform) => {
 //    const { moveSelectionBy } = plugin.transforms
 //    const { row, rowCount, rowIndex } = getPosition(transform)

 //    let moveBy = 0
 //    if (rowCount > 1 && rowIndex === 0) {
 //      moveBy = 1
 //    } else if (rowCount > 1 && rowIndex === rowCount - 1) {
 //      moveBy = -1
 //    }

 //    return moveSelectionBy(transform, 0, moveBy).removeNodeByKey(row.key)
 //  },
