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

const toggleFloat = (transform, toggle) => {
  let { startBlock: block } = transform.state

  if (isWithinTable(transform.state)) {
    block = getTableInfo(transform).table
  }

  return toggleStyle(transform, block, 'float', toggle).apply()
}

export default {
  toolbarButtons: [
    ...ALIGNMENTS.map(textAlign => ({
      icon:      `align-${textAlign}`,
      isActive:  state => getStyle(state.startBlock, 'textAlign') === textAlign,
      onClick:   state => toggleAlign(state, textAlign),
      isVisible: true,
    })),
    ...FLOATS.map(float => ({
      icon:      `float-${float}`,
      isActive:  state => getStyle(state.startBlock, 'float') === float,
      onClick:   state => toggleFloat(state.transform(), float),
      isVisible: true,
    })),
  ],
}
