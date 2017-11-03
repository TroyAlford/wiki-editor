import React, { Component } from 'react'

class MenuItem extends Component {
  handleMouseDown = (event) => {
    event.preventDefault()
    this.props.onClick(event)
  }

  render() {
    const { children, tagName: TagName, ...props } = this.props
    return <TagName {...props} onMouseDown={this.handleMouseDown}>{children}</TagName>
  }
}

export default MenuItem

export const Divider = () => <div className={`${MenuItem.defaultProps.className} divider`} />

if (process.env.NODE_ENV !== 'production') {
  const PropTypes = require('prop-types')

  MenuItem.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(React.PropTypes.node),
      PropTypes.node,
    ]),
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
}
