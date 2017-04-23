/* eslint-disable react/react-in-jsx-scope,react/prop-types */
// import EditTablePlugin from 'slate-edit-table'
import * as Actions from './Table/Actions'

const options = {
  typeTable: 'table',
  typeRow:   'tr',
  typeCell:  'td',

  defaultAlign: 'justify',
}

// const plugin = EditTablePlugin(options)

const MAPPINGS = [
  { icon: 'add-table', action: 'insertTable', params: [1, 1], alwaysVisible: true },
  { text: 'Remove Table', action: 'removeTable' },

  { text: 'Insert Column', action: 'insertColumn' },
  { text: 'Insert Row', action: 'insertRow' },
  { text: 'Remove Column', action: 'removeColumn' },
  { text: 'Remove Row', action: 'removeRow' },

  { icon: 'align-left', params: ['left'], action: 'setColumnAlign' },
  { icon: 'align-right', params: ['right'], action: 'setColumnAlign' },
  { icon: 'align-center', params: ['center'], action: 'setColumnAlign' },
  { icon: 'align-justify', params: ['justify'], action: 'setColumnAlign' },
]

const applyAction = (action, state, params) => {
  const fn = Actions[action]
  if (typeof fn !== 'function') return state

  return fn(state.transform(), ...params).apply()
}

function isWithinTable(state) {
  if (!state.selection.startKey) return false
  return (state.startBlock.type === 'td')
}

export default {
  schema: {
    nodes: {
      table: props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
      tr:    props => <tr {...props.attributes}>{props.children}</tr>,
      td:    (props) => {
        // const { columnIndex, table } = getPosition(props)
        // const align = table.data.get('align')[columnIndex] || options.defaultAlign
        return <td style={{ textAlign: 'left' }} {...props.attributes}>{props.children}</td>
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
        case 'td': // eslint-disable-line no-case-declarations
          const textAlign = object.data.get('align') || options.defaultAlign
          return <td style={{ textAlign }} {...object.attributes}>{children}</td>
        default:
          return undefined
      }
    },
  }],

  toolbarButtons: MAPPINGS.filter(m => m.icon || m.text)
    .reduce((all, { alwaysVisible, action, icon, text, params = [] }) => [
      ...all, {
        icon,
        text,
        isActive:  () => false,
        onClick:   state => applyAction(action, state, params),
        isVisible: state => alwaysVisible || isWithinTable(state),
      },
    ], [])
  ,
}
