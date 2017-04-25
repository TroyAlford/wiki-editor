export const findWordBoundaries = (text, position) => {
  const before = position > 0 ? text.slice(0, position) : ''
  const after = position < text.length ? text.slice(position) : ''

  let offsetLeft = before.split('')
    .reverse().join('').search(/\W/)
  if (offsetLeft === -1) offsetLeft = before.length

  let offsetRight = after.search(/\W/)
  if (offsetRight === -1) offsetRight = after.length

  return { offsetLeft, offsetRight }
}

export default findWordBoundaries
