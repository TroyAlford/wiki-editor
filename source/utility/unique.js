export default (first, ...rest) => {
  let all

  if (rest.length) {
    all = [first, ...rest]
  } else if (Array.isArray(first)) {
    all = first
  } else {
    all = [first]
  }

  return Array.from((new Set(all)))
}
