export const flow = (functions, startWith) => (
  functions.reduce((value, fn) => fn(value), startWith)
)

export default flow
