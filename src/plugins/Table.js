/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import * as Actions from './Table/Actions'
import Events from './Table/Events'
import { renderAligned } from './Alignment'

const BUTTONS = [
  { icon: 'add-table', action: 'insertTable', params: [1, 1], alwaysVisible: true },

  { icon: 'insert-column-left', action: 'insertColumn', params: ['left'] },
  { icon: 'insert-column-right', action: 'insertColumn', params: ['right'] },
  { icon: 'insert-row-above', action: 'insertRow', params: ['above'] },
  { icon: 'insert-row-below', action: 'insertRow', params: ['below'] },
  { icon: 'delete-column', action: 'deleteColumn' },
  { icon: 'delete-row', action: 'deleteRow' },
  { icon: 'delete-table', action: 'deleteTable' },
]

const applyAction = (action, state, params) => {
  const fn = Actions[action]
  if (typeof fn !== 'function') return state

  return fn(state.transform(), ...params).apply()
}

export function isWithinTable(state) {
  if (!state.selection.startKey) return false
  return (state.startBlock.type === 'td')
}

export default {
  ...Events,

  schema: {
    nodes: {
      table: props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
      tr:    props => <tr {...props.attributes}>{props.children}</tr>,

      td: ({ attributes, children, node }) => (
        renderAligned('td', node.data, children, attributes)
      ),
    },
  },

  serializers: [{
    deserialize(el, next) {
      const node = {
        kind:  'block',
        type:  el.tagName,
        nodes: next(el.children),
      }

      switch (el.tagName) {
        case 'table':
        case 'tr':
          return node
        case 'td':
          return {
            ...node,
          }
        default:
          return undefined
      }
    },
    serialize(object, children) {
      switch (object.type) {
        case 'table':
          return <table><tbody {...object.attributes}>{children}</tbody></table>
        case 'tr':
          return <tr {...object.attributes}>{children}</tr>
        case 'td':
          return renderAligned('td', object.data, children, {})
        default:
          return undefined
      }
    },
  }],

  toolbarButtons: BUTTONS.filter(m => m.icon || m.text)
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
