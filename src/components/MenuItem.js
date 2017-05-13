import React from 'react'
import PropTypes from 'prop-types'

const MenuItem = ({ children, className, onClick, tagName: TagName, ...props }) => (
  <TagName
    {...props}
    className={className}
    onMouseDown={(event) => {
      event.preventDefault()
      onClick(event)
    }}
  >{children}</TagName>
)

MenuItem.propTypes = {
  children:  PropTypes.any,
  className: PropTypes.string,
  onClick:   PropTypes.func.isRequired,
  tagName:   PropTypes.string,
}
MenuItem.defaultProps = {
  children:  [],
  className: 'menu item',
  onClick:   () => {},
  tagName:   'div',
}

export default MenuItem

export const Divider = () => (
  <div
    className={[
      MenuItem.defaultProps.className,
      'divider',
    ].join(' ')}
  />
)
