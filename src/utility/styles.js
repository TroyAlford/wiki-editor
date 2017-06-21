import { Map } from 'immutable'

export const toggleStyle = (transform, block, property, toggle) => {
  let style = block.data.get('style') || {}
  if (style instanceof Map) style = style.toObject()

  const updated = { ...style }

  if (updated[property] === toggle) {
    updated[property] = undefined
  } else {
    updated[property] = toggle
  }

  return transform.setNodeByKey(block.key, {
    data: block.data.merge({ style: updated }),
  })
}

export const getStyle = (block, property) => {
  const style = block.data.get('style') || {}
  if (property) return style[property]

  return style
}
