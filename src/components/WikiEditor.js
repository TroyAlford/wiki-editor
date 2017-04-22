import React, { Component, PropTypes } from 'react'
import { Editor, Raw } from 'slate'
import schema from './WikiEditor.schema'

const DEFAULT_NODE = 'paragraph'

export default class WikiEditor extends Component {
  constructor(props) {
    super(props)
    this.state = { state: Raw.deserialize(props.state) }
  }

  componentWillReceiveProps(props) {
    this.setState({ state: Raw.deserialize(props.state) })
  }

  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown = (e, data, state) => {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    e.preventDefault()
    state
      .transform()
      .toggleMark(mark)
      .apply()
  }

  onClickBlock = (e, type) => {
    e.preventDefault()
    let { state } = this.state
    const transform = state.transform()
    const { document } = state

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    } else {
      const isList = this.hasBlock('list-item')
      const isType = state.blocks.some(block => (
        !!document.getClosest(block.key, parent => parent.type === type)
      ))

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    state = transform.apply()
    this.setState({ state })
  }

  onClickMark = (e, type) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .toggleMark(type)
      .apply()

    this.setState({ state })
  }

  hasBlock = (type) => {
    const { state } = this.state
    return state.blocks.some(node => node.type === type)
  }

  hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type === type)
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderBlockButton = (type, icon) => {
    const isActive = this.hasBlock(type)
    const onMouseDown = e => this.onClickBlock(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderToolbar = () => (
    <div className="menu toolbar-menu">
      {this.renderMarkButton('bold', 'format_bold')}
      {this.renderMarkButton('italic', 'format_italic')}
      {this.renderMarkButton('underlined', 'format_underlined')}
      {this.renderMarkButton('code', 'code')}
      {this.renderBlockButton('heading-one', 'looks_one')}
      {this.renderBlockButton('heading-two', 'looks_two')}
      {this.renderBlockButton('block-quote', 'format_quote')}
      {this.renderBlockButton('numbered-list', 'format_list_numbered')}
      {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
    </div>
  )

  renderEditor = () => (
    <div className="editor">
      <Editor
        spellCheck
        placeholder={'Enter some rich text...'}
        schema={schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
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
  state: PropTypes.shape(),
}
WikiEditor.defaultProps = {
  state: {},
}
