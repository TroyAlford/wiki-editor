import camelCase from './camelCase'

export default function parseStyle(style) {
  if (typeof style === 'string') {
    return style.split(';').filter(r => r)
      .reduce((map, rule) => {
        const name = rule.slice(0, rule.indexOf(':')).trim()
        const value = rule.slice(rule.indexOf(':') + 1).trim()

        return {
          ...map,
          [camelCase(name)]: value,
        }
      }, {})
  } else if (style instanceof Node && style.nodeType === 2) {
    return parseStyle(style.textContent)
  } else if (typeof style === 'object') {
    return style
  }

  return undefined
}
