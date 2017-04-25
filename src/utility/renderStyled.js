/* eslint-disable react/react-in-jsx-scope,react/prop-types */
export const renderStyled = (Tag, data, children, attributes = {}) => {
  const style = data.get('style') || {}
  return <Tag style={style} {...attributes}>{children}</Tag>
}

export default renderStyled
