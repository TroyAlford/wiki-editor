import unique from './unique'

describe('unique', () => {
  it('de-duplicates a single input array', () => {
    expect(unique(['a', 'b', 'c', 'b'])).toEqual(['a', 'b', 'c'])
  })

  it('de-duplicates values entered as individual arguments', () => {
    expect(unique(1, 2, 3, 1)).toEqual([1, 2, 3])
  })

  it('treats a first-param array with other params as a value', () => {
    expect(unique([1, 2, 3], 1, 2, 1)).toEqual([[1, 2, 3], 1, 2])
  })
})
