import React, { Component, PropTypes } from 'react'
import { Editor, Html } from 'slate'
import { plugins, rules, schema, toolbar } from '../plugins'

const HtmlSerializer = new Html({ rules })

export default class WikiEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: HtmlSerializer.deserialize(props.html),
      schema,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      state: HtmlSerializer.deserialize(props.html),
    })
  }

  onChange = (state) => {
    this.setState({ state })
  }

  // onClickBlock = (e, type) => {
  //   e.preventDefault()
  //   let { state } = this.state
  //   const transform = state.transform()
  //   const { document } = state

  //   if (type !== 'bulleted-list' && type !== 'numbered-list') {
  //     const isActive = this.hasBlock(type)
  //     const isList = this.hasBlock('list-item')

  //     if (isList) {
  //       transform
  //         .setBlock(isActive ? DEFAULT_NODE : type)
  //         .unwrapBlock('bulleted-list')
  //         .unwrapBlock('numbered-list')
  //     } else {
  //       transform
  //         .setBlock(isActive ? DEFAULT_NODE : type)
  //     }
  //   } else {
  //     const isList = this.hasBlock('list-item')
  //     const isType = state.blocks.some(block => (
  //       !!document.getClosest(block.key, parent => parent.type === type)
  //     ))

  //     if (isList && isType) {
  //       transform
  //         .setBlock(DEFAULT_NODE)
  //         .unwrapBlock('bulleted-list')
  //         .unwrapBlock('numbered-list')
  //     } else if (isList) {
  //       transform
  //         .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
  //         .wrapBlock(type)
  //     } else {
  //       transform
  //         .setBlock('list-item')
  //         .wrapBlock(type)
  //     }
  //   }

  //   state = transform.apply()
  //   this.setState({ state })
  // }

  // onClickMark = (e, type) => {
  //   e.preventDefault()
  //   let { state } = this.state

  //   state = state
  //     .transform()
  //     .toggleMark(type)
  //     .apply()

  //   this.setState({ state })
  // }

  // hasBlock = (type) => {
  //   const { state } = this.state
  //   return state.blocks.some(node => node.type === type)
  // }

  // renderBlockButton = (type, icon) => {
  //   const isActive = this.hasBlock(type)
  //   const onMouseDown = e => this.onClickBlock(e, type)

  //   return (
  //     <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
  //       <span className="material-icons">{icon}</span>
  //     </span>
  //   )
  // }

  handleToolbar = (event, button) => {
    event.preventDefault()
    const state = button.onClick(this.state.state)
    if (state) this.setState({ state })
  }
  renderToolbar = () => (
    <div className="menu toolbar-menu">
      {toolbar.map(button => (
        <button
          data-active={button.isActive(this.state.state)}
          className={`icon icon-${button.mark}`}
          onMouseDown={event => this.handleToolbar(event, button)}
        />
      ))}
    </div>
  )

  renderEditor = () => (
    <div className="editor">
      <Editor
        spellCheck
        placeholder="Enter some rich text..."
        plugins={plugins}
        schema={schema}
        state={this.state.state}
        onChange={this.onChange}
      />
    </div>
  )

  render = () => (
    <div>
      {this.renderToolbar()}
      {this.renderEditor()}
    </div>
  )
}

WikiEditor.propTypes = {
  html: PropTypes.string,

  toolbar: PropTypes.arrayOf(PropTypes.shape({
    mark:     PropTypes.string.isRequired,
    isActive: PropTypes.func.isRequired,
    onClick:  PropTypes.func.isRequired,
  })),
}
WikiEditor.defaultProps = {
  html: '<b>Test!</b>',
  toolbar,
}
