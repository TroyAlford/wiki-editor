import React, { Component } from 'react'

export default class DropdownMenu extends Component {
  static defaultProps = {
    className: 'menu dropdown',
    children:  [],
    label:     'Menu',
  }

  state = { expanded: false }

  toggleExpanded = (event) => {
    event.preventDefault()
    this.setState({ expanded: !this.state.expanded })
  }

  render = () => {
    const { className, children, label } = this.props
    return (
      <div className={className} onMouseDown={this.toggleExpanded}>
        <div className="label">{label}</div>
        {this.state.expanded && children &&
          <div className="flyout">{children}</div>
        }
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const PropTypes = require('prop-types')

  DropdownMenu.propTypes = {
    className: PropTypes.string,
    children:  PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    label: PropTypes.string,
  }
}
