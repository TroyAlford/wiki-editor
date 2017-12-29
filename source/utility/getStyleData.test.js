import getStyleData from './getStyleData'

jest.unmock('./getStyleData')

describe('getStyleData', () => {
  it('extracts className from class', () => {
    const htmlElement = { classList: ['my', 'class', 'names'] }
    const result = getStyleData(htmlElement)
    expect(result.className).toEqual('my class names')
  })

  it('normalizes className', () => {
    const htmlElement = { classList: ['some', 'classes', 'and', 'classes', 'no', 'duplicates'] }
    const result = getStyleData(htmlElement)
    expect(result.className).toEqual('some classes and no duplicates')
  })

  it('extracts style object from style string', () => {
    const htmlElement = { attributes: { style: 'color: red;' } }
    const result = getStyleData(htmlElement)
    expect(result.style).toEqual({ color: 'red' })
  })
})
