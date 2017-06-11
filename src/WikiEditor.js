import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, Html } from 'slate'
import plugins, { schema, serializers } from './plugins'

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
      autoFocus={this.props.autoFocus}
      spellCheck={this.props.spellCheck}
      placeholder={this.props.placeholder}
      plugins={[
        ...this.props.corePlugins || plugins,
        ...this.props.plugins,
      ]}
      schema={{
        ...this.props.coreSchema,
        ...this.props.schema,
      }}
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

const schemaType = PropTypes.shape({
  nodes: PropTypes.shape({}),
  marks: PropTypes.shape({}),
  rules: PropTypes.arrayOf(PropTypes.shape({
    decorate:  PropTypes.func,
    match:     PropTypes.func,
    normalize: PropTypes.func,
    render:    PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    validate: PropTypes.func,
  })),
})

const pluginType = PropTypes.shape({
  onBeforeChange: PropTypes.func,
  onBeforeInput:  PropTypes.func,
  onBlur:         PropTypes.func,
  onChange:       PropTypes.func,
  onCopy:         PropTypes.func,
  onCut:          PropTypes.func,
  onDrop:         PropTypes.func,
  onKeyDown:      PropTypes.func,
  onPaste:        PropTypes.func,
  onSelect:       PropTypes.func,
  render:         PropTypes.func,
  schema:         PropTypes.arrayOf(schemaType),
})

WikiEditor.propTypes = {
  autoFocus:   PropTypes.bool,
  className:   PropTypes.string,
  corePlugins: PropTypes.arrayOf(pluginType),
  coreSchema:  schemaType,
  placeholder: PropTypes.string,
  plugins:     PropTypes.arrayOf(pluginType),
  readOnly:    PropTypes.bool,
  schema:      schemaType,
  spellCheck:  PropTypes.bool,

  toolbarClassName:            PropTypes.string,
  toolbarButtonGroupClassName: PropTypes.string,
  toolbarButtonClassName:      PropTypes.string,

  onHtmlChange: PropTypes.func,

  html: PropTypes.string,
}

/* eslint react/no-unused-prop-types: "off" */
WikiEditor.defaultProps = {
  autoFocus:   true,
  className:   'wiki-editor',
  corePlugins: plugins,
  coreSchema:  schema,
  placeholder: 'Enter some text...',
  plugins:     [],
  readOnly:    false,
  schema:      {},
  spellCheck:  true,

  toolbarClassName:            'menu toolbar-menu',
  toolbarButtonGroupClassName: 'toolbar-button-group',
  toolbarButtonClassName:      'toolbar-button',

  onHtmlChange: undefined,

  html: '<p></p>',
}
