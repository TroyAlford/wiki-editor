/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import * as Actions from './Table/Actions'
import events from './Table/Events'
import rules from './Table/Rules'
import { contains } from '../utility/contains'
import getStyleData from '../utility/getStyleData'
import renderStyled from '../utility/renderStyled'

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
  const doc = state.document
  const ancestors = state.document.getAncestors(state.selection.startKey)
  const tableParents = ancestors.filter(a =>
    contains(['table', 'tbody', 'tr', 'th', 'td'], a.type)
  )
  return Boolean(tableParents.size)
}

const renderCell = (Tag, { attributes = {}, children, data, node }) =>
  renderStyled(Tag, {
    attributes: {
      ...attributes,
      colSpan: (data || node.data).get('colSpan'),
      rowSpan: (data || node.data).get('rowSpan'),
    },
    children,
    data: data || node.data,
  })

export default {
  ...events,

  schema: {
    rules,
    nodes: {
      table: ({ children, node: { data } }) => renderStyled('table', {
        children: <tbody>{children}</tbody>,
        data,
      }),

      tr: ({ children, node: { data } }) => renderStyled('tr', { children, data }),

      th: props => renderCell('th', props),
      td: props => renderCell('td', props),
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

        const data = {}
        if (el.tagName === 'th' || el.tagName === 'td') {
          data.colSpan = el.attribs.colspan
          data.rowSpan = el.attribs.rowspan
        }

        return {
          kind:  'block',
          type:  el.tagName,
          data:  { ...data, ...getStyleData(el) },
          nodes: next(children),
        }
      }

      return undefined
    },
    serialize(object, children) {
      const data = object.data || new Map()

      switch (object.type) {
        case 'table': // eslint-disable-line no-case-declarations
          return renderStyled(object.type, {
            children: <tbody>{children}</tbody>,
            data,
          })
        case 'tr':
          return renderStyled(object.type, { children, data })
        case 'th':
        case 'td':
          return renderCell(object.type, { children, data })
        default:
          return undefined
      }
    },
  }],

  renderToolbar: (state, props, setState) => (
    <div key="table-toolbar" className={props.toolbarButtonGroupClassName}>
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
