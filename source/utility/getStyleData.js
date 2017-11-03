import parseStyle from './parseStyle'

export default ({ attribs = {} }) => ({
  className: [...new Set((attribs.class || '').split(' ').filter(cn => cn))].join(' '),
  style:     parseStyle(attribs.style || {}),
})
