/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import parseStyle from './parseStyle'

export const getStyleData = ({ attribs, style }) => ({
	className: (attribs.class || '').split(' ').filter(cn => cn).join(' '),
	style: parseStyle(attribs.style || {}),
})

export const renderStyled = (Tag, data, children, attributes = {}) => {
  const style = data.get('style') || {}
  const className = data.get('className') || undefined

  return <Tag {...attributes } {...{ className, style }}>{children || []}</Tag>
}
