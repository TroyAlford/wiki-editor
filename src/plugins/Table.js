/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import * as Actions from './Table/Actions'
import events from './Table/Events'
import rules from './Table/Rules'
import { contains } from '../utility/contains'
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
  return (contains(['td', 'th'], state.startBlock.type))
}

export default {
  ...events,

  schema: {
    rules,
    nodes: {
      table: ({ attributes, children, node }) => {
        const style = node.data.get('style') || {}
        return (
          <table style={style} {...attributes}>
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
      if (contains(['table', 'tr', 'th', 'td'], el.tagName)) {
        const children = el.children.filter(
          // Remove text-type, whitespace-only children
          child => !(child.type === 'text' && /^\s+$/.test(child.data))
        ).map(child => (
          child.type === 'text'
            // Trim remaining children to drop leading/trailing whitespace
            ? { ...child, data: child.data.trim() }
            : child
        ))
        return {
          kind:  'block',
          type:  el.tagName,
          nodes: next(children),
        }
      }

      return undefined
    },
    serialize(object, children) {
      switch (object.type) {
        case 'table': // eslint-disable-line no-case-declarations
          const style = object.data.get('style') || {}
          return (
            <table style={style}>
              <tbody {...object.attributes}>{children}</tbody>
            </table>
          )
        case 'tr':
          return <tr {...object.attributes}>{children}</tr>
        case 'th':
        case 'td':
          return renderStyled(object.type, object.data, children, {})
        default:
          return undefined
      }
    },
  }],

  renderToolbar: (state, props, setState) => (
    <div className={props.toolbarButtonGroupClassName}>
      {BUTTONS.filter(({ alwaysVisible }) => alwaysVisible || isWithinTable(state))
        .map(({ action, params = [], icon }) => {
          const className = [
            props.toolbarButtonClassName,
            `icon icon-${icon}`,
          ].join(' ')

          const onMouseDown = (event) => {
            event.preventDefault()
            setState(applyAction(action, state, params))
          }

          return <button key={icon} className={className} onMouseDown={onMouseDown} />
        })
      }
    </div>
  ),
}
