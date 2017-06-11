export const toggleStyle = (transform, block, property, toggle) => {
  const style = block.data.get('style') || {}

  if (style[property] === toggle) {
    style[property] = undefined
  } else {
    style[property] = toggle
  }

  return transform.setNodeByKey(block.key, {
    data: block.data.merge({ style }),
  })
}

export const getStyle = (block, property) => {
  const style = block.data.get('style') || {}
  if (property) return style[property]

  return style
}
