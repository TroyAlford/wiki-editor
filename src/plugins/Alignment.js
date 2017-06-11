/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import { getStyle, toggleStyle } from '../utility/styles'
import { isWithinTable } from './Table'
import { getTableInfo } from './Table/Actions'

const ALIGNMENTS = ['left', 'center', 'right', 'justify']
const FLOATS = ['left', 'right']

const toggleAlign = (state, alignment) => {
  const transform = state.transform()
  return toggleStyle(transform, state.startBlock, 'textAlign', alignment).apply()
}

const toggleFloat = (state, toggle) => {
  let { startBlock: block } = state

  if (isWithinTable(state)) {
    block = getTableInfo({ state }).table
  }

  return toggleStyle(state.transform(), block, 'float', toggle).apply()
}

const isActiveClass = ({ startBlock }, prop, value) => (
  getStyle(startBlock, prop) === value ? 'is-active' : 'is-inactive'
)

const toolbarButtons = [
  ...ALIGNMENTS.map(textAlign => ({
    styleProp:  'textAlign',
    styleValue: textAlign,
    iconPrefix: 'align',
    onActivate: state => toggleAlign(state, textAlign),
  })),
  ...FLOATS.map(float => ({
    styleProp:  'float',
    styleValue: float,
    iconPrefix: 'float',
    onActivate: state => toggleFloat(state, float),
  })),
]

export default {
  renderToolbar: (state, props, setState) => (
    <div key="alignment-toolbar" className={props.toolbarButtonGroupClassName}>
      {toolbarButtons.map((button) => {
        const className = [
          props.toolbarButtonClassName,
          isActiveClass(state, button.styleProp, button.styleValue),
          `icon icon-${button.iconPrefix}-${button.styleValue}`,
        ].join(' ')

        const onMouseDown = (event) => {
          event.preventDefault()
          setState(button.onActivate(state))
        }

        const key = `${button.styleProp}-${button.styleValue}`
        return <button key={key} className={className} onMouseDown={onMouseDown} />
      })}
    </div>
  ),
}
