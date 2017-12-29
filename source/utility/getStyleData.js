import parseStyle from './parseStyle'
import unique from './unique'

export default ({ attributes = {}, classList = [] }) => ({
  className: unique(Array.from(classList)).join(' '),
  style:     parseStyle(attributes.style || {}),
})
