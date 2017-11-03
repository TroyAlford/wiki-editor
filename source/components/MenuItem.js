import React, { Component } from 'react'

class MenuItem extends Component {
  static defaultProps = {
    children:  [],
    className: 'menu item',
    onClick:   () => { },
    tagName:   'div',
  }

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
  /* eslint-disable global-require, react/require-default-props */
  const PropTypes = require('prop-types')

  MenuItem.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    onClick:   PropTypes.func,
    tagName:   PropTypes.string,
  }
}
