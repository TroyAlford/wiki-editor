import getStyleData from './getStyleData'

jest.unmock('./getStyleData')

describe('getStyleData', () => {
  it('extracts className from class', () => {
    const htmlElement = { attribs: { class: 'my class names' } }
    const result = getStyleData(htmlElement)
    expect(result.className).toEqual('my class names')
  })

  it('normalizes className', () => {
    const htmlElement = { attribs: { class: 'some   classes and   classes no duplicates' } }
    const result = getStyleData(htmlElement)
    expect(result.className).toEqual('some classes and no duplicates')
  })

  it('extracts style object from style string', () => {
    const htmlElement = { attribs: { style: 'color: red;' } }
    const result = getStyleData(htmlElement)
    expect(result.style).toEqual({ color: 'red' })
  })
})
