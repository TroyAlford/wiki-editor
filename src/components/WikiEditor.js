import React, { Component, PropTypes } from 'react'
import { Editor, Html } from 'slate'
import plugins, { schema, serializers } from '../plugins'

const HtmlSerializer = new Html({ rules: serializers })

export default class WikiEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: HtmlSerializer.deserialize(props.html),
      schema,
    }
  }

  componentWillReceiveProps(props) {
    if (props.html !== this.props.html) {
      this.setState({ state: HtmlSerializer.deserialize(props.html) })
    }
  }

  onChange = (state, callback) => {
    this.setState({ state }, callback)

    if (typeof this.props.onHtmlChange === 'function') {
      this.props.onHtmlChange(HtmlSerializer.serialize(state))
    }
  }

  handlePluginStateChange = state => this.onChange(state, this.editor.focus)

  renderToolbar = () => (
    <div className={this.props.toolbarClassName}>
      {plugins.filter(p => typeof p.renderToolbar === 'function').map(p =>
        p.renderToolbar(this.state.state, this.props, this.handlePluginStateChange)
      )}
    </div>
  )

  renderEditor = () => (
    <Editor
      spellCheck={this.props.spellCheck}
      placeholder={this.props.placeholder}
      plugins={plugins} schema={schema}
      state={this.state.state}
      onChange={this.onChange}
      ref={(self) => { this.editor = self }}
    />
  )

  render = () => (
    <div className={this.props.className}>
      {this.renderToolbar()}
      {this.renderEditor()}
    </div>
  )
}

WikiEditor.propTypes = {
  className:   PropTypes.string,
  html:        PropTypes.string,
  placeholder: PropTypes.string,
  spellCheck:  PropTypes.bool,

  toolbarClassName:            PropTypes.string,
  toolbarButtonGroupClassName: PropTypes.string,
  toolbarButtonClassName:      PropTypes.string,

  onHtmlChange: PropTypes.func,
}
WikiEditor.defaultProps = {
  className:   'wiki-editor',
  html:        '<p></p>',
  placeholder: 'Enter some text...',
  spellCheck:  true,

  toolbarClassName:            'menu toolbar-menu',
  toolbarButtonGroupClassName: 'toolbar-button-group',
  toolbarButtonClassName:      'toolbar-button',

  onHtmlChange: undefined,
}
