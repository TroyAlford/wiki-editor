import Slate from 'slate'
import { flow } from '../../utility/flow'
import { Paragraph } from '../Paragraph'
import { isWithinTable } from '../Table'
import { getTableInfo, insertColumn, insertRow, moveTo } from './Actions'

function isHotkeyCommand(event) {
  return (event.metaKey || event.ctrlKey) && event.shiftKey
}

function onDelete(transform, event, state) {
  const { startBlock, startOffset, isCollapsed, endBlock } = state

  if (startBlock === endBlock && isHotkeyCommand(event)) {
    // Clear cell contents
    const range = Slate.Selection.create().moveToRangeOf(startBlock)
    return transform.deleteAtRange(range).collapseToStartOf(startBlock).apply()
  }

  // Default: delete the cell itself. This would be wrong. :)
  if (isCollapsed && startOffset === 0) return state // << Handle, making no change

  // Default: clear the whole cell. This would be wrong, too. :)
  if (startBlock === endBlock) return undefined // << Pass to default handler

  event.preventDefault()

  const { blocks, focusBlock } = state
  return flow([
    t => blocks.reduce((result, block) => {
      if (block.type !== 'td') return result
      const range = Slate.Selection.create().moveToRangeOf(block)
      return result.deleteAtRange(range)
    }, t),
    t => t.collapseToStartOf(focusBlock),
  ], transform).apply()
}

function onDown(transform, event, state) {
  event.preventDefault()
  const { x, y, height, table } = getTableInfo({ state })

  if (isHotkeyCommand(event)) {
    return flow([
      t => insertRow(t, 'below'),
      t => moveTo(t, x, y + 1),
    ], transform)
  }

  if (y === height - 1) { // Last Row - move out of table
    let sibling = state.document.getNextSibling(table.key)
    let t = transform

    if (!sibling) {
      const parent = state.document.getParent(table.key)
      const tableIndex = parent.nodes.findIndex(n => n === table)

      sibling = Paragraph.create()
      t = t.insertNodeByKey(parent.key, tableIndex + 1, sibling)
    }

    return t.collapseToStartOf(sibling).moveOffsetsTo(0)
  }

  return moveTo(transform, x, y + 1)
}

function onEnter(transform, event, state) {
  event.preventDefault()
  const { x, y, height } = getTableInfo({ state })

  if (y === height - 1) { // last row
    return flow([
      t => insertRow(t, 'below'),
      t => moveTo(t, x, y + 1),
    ], transform)
  }

  return moveTo(transform, x, y + 1)
}

function onH(transform, event, state) {
  if (!isHotkeyCommand(event)) return undefined
  const cell = state.startBlock
  return transform.setBlock({
    type: cell.type === 'td' ? 'th' : 'td',
  }).apply()
}

function onLeft(transform, event, state) {
  if (isHotkeyCommand(event)) {
    const { x, y } = getTableInfo({ state })
    return flow([
      t => insertColumn(t, 'left'),
      t => moveTo(t, x, y),
    ], transform)
  }

  return transform
}

function onRight(transform, event, state) {
  if (isHotkeyCommand(event)) {
    const { x, y } = getTableInfo({ state })
    return flow([
      t => insertColumn(t, 'right'),
      t => moveTo(t, x + 1, y),
    ], transform)
  }

  return transform
}

function onTab(transform, event, state) {
  event.preventDefault()
  const { x, y, height, width } = getTableInfo({ state })

  if (x === width - 1 && y === height - 1) {
    // bottom-right corner
    return flow([
      t => insertRow(t, 'after'),
      t => moveTo(t, 0, y + 1),
    ], transform)
  }

  const toX = x < width - 1 ? x + 1 : 0
  const toY = x === 0 ? y + 1 : y

  return moveTo(transform, toX, toY)
}

function onUp(transform, event, state) {
  event.preventDefault()
  const { x, y, table } = getTableInfo({ state })

  if (isHotkeyCommand(event)) {
    return flow([
      t => insertRow(t, 'above'),
      t => moveTo(t, x, y),
    ], transform)
  }

  if (y === 0) { // First Row - move out of table
    let sibling = state.document.getPreviousSibling(table.key)
    let t = transform

    if (event.shiftKey && !sibling) {
      const parent = state.document.getParent(table.key)
      const tableIndex = parent.nodes.findIndex(n => n === table)

      sibling = Paragraph.create()
      t = t.insertNodeByKey(parent.key, tableIndex, sibling)
    }

    if (sibling) t = t.collapseToStartOf(sibling)

    return t.moveOffsetsTo(0)
  }

  return moveTo(transform, x, y - 1)
}

export default {
  onKeyDown: (event, data, state) => {
    if (!isWithinTable(state)) return undefined

    const transform = state.transform()
    switch (data.key) {
      case 'backspace':
      case 'delete':
        return onDelete(transform, event, state)
      case 'down':
        return onDown(transform, event, state).apply()
      case 'enter':
        return onEnter(transform, event, state).apply()
      case 'h':
        return onH(transform, event, state)
      case 'left':
        return onLeft(transform, event, state).apply()
      case 'right':
        return onRight(transform, event, state).apply()
      case 'tab':
        return onTab(transform, event, state).apply()
      case 'up':
        return onUp(transform, event, state).apply()
      default:
        return undefined
    }
  },
}
