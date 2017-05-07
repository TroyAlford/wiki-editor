/* eslint-disable react/react-in-jsx-scope,react/prop-types */
export const renderStyled = (Tag, data, children, attributes = {}) => {
  const style = data.get('style') || {}
  if (children) {
    return <Tag style={style} {...attributes}>{children}</Tag>
  }

  return <Tag style={style} {...attributes} />
}

export default renderStyled
