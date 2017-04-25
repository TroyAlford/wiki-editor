/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import { contains } from '../utility/contains'
import { isWithinTable } from './Table'
import { getTableInfo } from './Table/Actions'

const ALIGNMENTS = ['left', 'center', 'right', 'justify']
const FLOATS = ['left', 'right']
const NO_FLOAT = ['td', 'tr', 'tbody']

const applyAlignment = (transform, textAlign) => {
  const { startBlock: block } = transform.state
  return transform.setNodeByKey(block.key, {
    data: { ...block.data, textAlign },
  }).apply()
}
const toggleFloat = (transform, toggle) => {
  let { startBlock: block } = transform.state

  if (isWithinTable(transform.state)) {
    block = getTableInfo(transform).table
    console.log('attempting to apply to table')
  }

  const float = block.data.get('float') === toggle ? undefined : toggle
  return transform.setNodeByKey(block.key, {
    data: { ...block.data, float },
  }).apply()
}

export function renderAligned(Tag, data, children, attributes) {
  const float = !contains(NO_FLOAT, Tag) ? data.get('float') : undefined
  const style = {
    textAlign: data.get('textAlign') || 'inherit',
    float,
  }
  return <Tag style={style} {...attributes}>{children}</Tag>
}

export default {
  toolbarButtons: [
    ...ALIGNMENTS.map(textAlign => ({
      icon:      `align-${textAlign}`,
      isActive:  state => state.startBlock.data.get('textAlign') === textAlign,
      onClick:   state => applyAlignment(state.transform(), textAlign),
      isVisible: true,
    })),
    ...FLOATS.map(float => ({
      icon:      `float-${float}`,
      isActive:  state => state.startBlock.data.get('float') === float,
      onClick:   state => toggleFloat(state.transform(), float),
      isVisible: true,
    })),
  ],
}
