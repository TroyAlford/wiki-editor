/* eslint-disable react/react-in-jsx-scope,react/prop-types */
export const getStyleData = ({ attribs, style }) => {
	if (attribs.style) debugger;
	return {
		className: (attribs.class || '').split(' ').filter(cn => cn).join(' '),
		style: style || {},
	}
}

export const renderStyled = (Tag, data, children, attributes = {}) => {
  const style = data.get('style') || {}
  const className = data.get('className') || undefined

  return <Tag {...attributes } {...{ className, style }}>{children || []}</Tag>
}

export default renderStyled
