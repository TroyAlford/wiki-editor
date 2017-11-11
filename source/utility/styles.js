import { Map } from 'immutable'

export const toggleStyle = (transform, block, property, toggle) => {
  let style = block.data.get('style') || {}
  if (style instanceof Map) style = style.toJS()

  const updated = { ...style }

  if (updated[property] === toggle) {
    updated[property] = undefined
  } else {
    updated[property] = toggle
  }

  return transform.setNodeByKey(block.key, {
    data: block.data.merge({ style: Map(updated) }),
  })
}

export const getStyle = (block, property) => {
  let style = block.data.get('style') || {}
  if (style instanceof Map) style = style.toJS()
  if (property) return style[property]

  return style
}
