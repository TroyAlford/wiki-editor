/* eslint-disable react/react-in-jsx-scope,react/prop-types */
const ALIGNMENTS = ['left', 'center', 'right', 'justify']

const applyAlignment = (transform, textAlign) => {
  const { startBlock: block } = transform.state
  return transform.setNodeByKey(block.key, { data: { textAlign } }).apply()
}

export function renderAligned(Tag, data, children, attributes) {
  const textAlign = data.get('textAlign') || 'left'
  return <Tag style={{ textAlign }} {...attributes}>{children}</Tag>
}

export default {
  toolbarButtons: ALIGNMENTS.map(textAlign => ({
    icon:      `align-${textAlign}`,
    isActive:  state => state.startBlock.data.get('textAlign') === textAlign,
    onClick:   state => applyAlignment(state.transform(), textAlign),
    isVisible: true,
  })),
}
