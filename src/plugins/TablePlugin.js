/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import EditTablePlugin from 'slate-edit-table'
import { List } from 'immutable'

const options = {
  typeTable: 'table',
  typeRow:   'tr',
  typeCell:  'td',
}

const plugin = EditTablePlugin(options)

const MAPPINGS = [
  { icon: 'add-table', action: 'insertTable', params: [5, 5], alwaysVisible: true },
  { text: 'Remove Table', action: 'removeTable' },

  { text: 'Insert Column', action: 'insertColumn' },
  { text: 'Insert Row', action: 'insertRow' },
  { text: 'Remove Column', action: 'removeColumn' },
  { text: 'Remove Row', action: 'removeRow' },

  { icon: 'align-left', param: ['left'], action: 'setColumnAlign' },
  { icon: 'align-right', param: ['right'], action: 'setColumnAlign' },
  { icon: 'align-center', param: ['center'], action: 'setColumnAlign' },
  { icon: 'align-justify', param: ['justify'], action: 'setColumnAlign' },
]

const getPosition = (transform) => {
  const { state } = transform
  const cell = state.startBlock
  const row = state.document.getParent(cell.key)
  const table = state.document.getParent(row.key)
  return {
    cell,
    columnIndex: row.nodes.findIndex(c => c === cell),
    columnCount: row.nodes.size,
    row,
    rowIndex:    table.nodes.findIndex(r => r === row),
    rowCount:    table.nodes.size,
    table,
  }
}

const transforms = {
  ...plugin.transforms,

  insertColumn: (transform) => {
    const { moveSelectionBy, insertColumn } = plugin.transforms
    const { selection } = transform.state
    return insertColumn(moveSelectionBy(transform, -1, 0)).select(selection)
  },

  removeColumn: (transform) => {
    const { moveSelectionBy } = plugin.transforms
    const { columnCount, columnIndex, table } = getPosition(transform)

    let moveBy = 0
    if (columnCount > 1 && columnIndex === 0) {
      moveBy = 1
    } else if (columnCount > 1 && columnIndex === columnCount - 1) {
      moveBy = -1
    }

    const rows = table.nodes

    let t = moveSelectionBy(transform, moveBy, 0)
    if (columnCount > 1) {
      rows.forEach((row) => {
        const cell = row.nodes.get(columnIndex)
        t = t.removeNodeByKey(cell.key)
      })

      t = t.setNodeByKey(table.key, {
        data: {
          align: List(table.data.get('align')).delete(columnIndex),
        },
      })
    } else {
      rows.forEach((row) => {
        row.nodes.forEach((cell) => {
          cell.nodes.forEach((node) => {
            t = t.removeNodeByKey(node.key)
          })
        })
      })
    }

    return t
  },

  insertRow: (transform) => {
    const { moveSelectionBy, insertRow } = plugin.transforms
    const { selection } = transform.state
    return insertRow(moveSelectionBy(transform, 0, -1)).select(selection)
  },

  removeRow: (transform) => {
    const { moveSelectionBy } = plugin.transforms
    const { row, rowCount, rowIndex } = getPosition(transform)

    let moveBy = 0
    if (rowCount > 1 && rowIndex === 0) {
      moveBy = 1
    } else if (rowCount > 1 && rowIndex === rowCount - 1) {
      moveBy = -1
    }

    return moveSelectionBy(transform, 0, moveBy).removeNodeByKey(row.key)
  },
}

const applyAction = (action, state, params) => {
  const fn = transforms[action]
  if (typeof fn !== 'function') return state

  return fn(state.transform(), ...params).apply()
}

export default {
  ...plugin,

  schema: {
    ...plugin.schema,

    nodes: {
      table: props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
      tr:    props => <tr {...props.attributes}>{props.children}</tr>,
      td:    (props) => {
        const align = props.node.get('data').get('align') || 'justify'
        return <td style={{ textAlign: align }} {...props.attributes}>{props.children}</td>
      },
    },
  },

  serializers: [{
    deserialize(el, next) {
      switch (el.tagName) {
        case 'table':
        case 'tr':
        case 'td':
          return {
            kind:  'block',
            type:  el.tagName,
            nodes: next(el.children),
          }
        default:
          return undefined
      }
    },
    serialize(object, children) {
      if (object.kind !== 'block') return undefined
      switch (object.type) {
        case 'table':
          return <table><tbody {...object.attributes}>{children}</tbody></table>
        case 'tr':
          return <tr {...object.attributes}>{children}</tr>
        case 'td':
          return <td {...object.attributes}>{children}</td>
        default:
          return undefined
      }
    },
  }],

  transforms,

  toolbarButtons: MAPPINGS.filter(m => m.icon || m.text)
    .reduce((all, { alwaysVisible, action, icon, text, params = [] }) => [
      ...all, {
        icon,
        text,
        isActive:  () => false,
        onClick:   state => applyAction(action, state, params),
        isVisible: alwaysVisible || plugin.utils.isSelectionInTable,
      },
    ], [])
  ,
}
