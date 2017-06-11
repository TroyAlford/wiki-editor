import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class DropdownMenu extends Component {
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

DropdownMenu.propTypes = {
  className: PropTypes.string,
  children:  PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string.isRequired,
}
DropdownMenu.defaultProps = {
  className: 'menu dropdown',
  children:  [],
  label:     'Menu',
}
