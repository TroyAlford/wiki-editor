import React from 'react'
import PropTypes from 'prop-types'

const DropdownMenu = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
)

DropdownMenu.propTypes = {
  className: PropTypes.string,
  children:  PropTypes.any,
}
DropdownMenu.defaultProps = {
  className: 'menu dropdown',
  children:  [],
}

export default DropdownMenu
