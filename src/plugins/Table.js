/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import * as Actions from './Table/Actions'
import events from './Table/Events'
import rules from './Table/Rules'
import { renderStyled } from '../utility/renderStyled'

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
  ...events,

  schema: {
    rules,
    nodes: {
      table: ({ attributes, children, node }) => {
        const float = node.data.get('float') || undefined
        return (
          <table style={{ float }} {...attributes}>
            <tbody>{children}</tbody>
          </table>
        )
      },

      tr: props => <tr {...props.attributes}>{props.children}</tr>,

      td: ({ attributes, children, node }) => (
        renderStyled('td', node.data, children, attributes)
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
        case 'td':
          return node
        default:
          return undefined
      }
    },
    serialize(object, children) {
      switch (object.type) {
        case 'table': // eslint-disable-line no-case-declarations
          const float = object.data.get('float') || undefined
          return (
            <table style={{ float }}>
              <tbody {...object.attributes}>{children}</tbody>
            </table>
          )
        case 'tr':
          return <tr {...object.attributes}>{children}</tr>
        case 'td':
          return renderStyled('td', object.data, children, {})
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
