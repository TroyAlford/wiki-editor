import React, { Component } from 'react'
import { Editor, Html } from 'slate'
import plugins, { schema, serializers } from './plugins'

const HtmlSerializer = new Html({ rules: serializers })

export default class WikiEditor extends Component {
  static defaultProps = {
    autoFocus:   true,
    className:   'wiki-editor',
    corePlugins: plugins,
    coreSchema:  schema,
    placeholder: 'Enter some text...',
    plugins:     [],
    schema:      {},
    spellCheck:  true,

    toolbarClassName: 'menu toolbar-menu',

    onHtmlChange: undefined,

    defaultHtml: '<p></p>',
    html:        undefined,
  }

  constructor(props) {
    super(props)
    this.state = { state: HtmlSerializer.deserialize(props.html || props.defaultHtml) }
  }

  componentDidMount() {
    if (this.props.autoFocus) this.editor.focus()
  }

  componentWillReceiveProps(props) {
    if (props.html !== this.props.html) {
      this.setState({ state: HtmlSerializer.deserialize(props.html) })
    }
  }

  onChange = (state, callback) => {
    this.setState({ state }, callback)

    if (typeof this.props.onHtmlChange === 'function') {
      const html = HtmlSerializer.serialize(state)
      this.props.onHtmlChange(html)
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

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const PropTypes = require('prop-types')

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

  const schemaPropType = PropTypes.oneOfType([
    schemaType,
    PropTypes.arrayOf(schemaType),
  ])

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
    schema:         schemaPropType,
  })

  WikiEditor.propTypes = {
    autoFocus:   PropTypes.bool,
    className:   PropTypes.string,
    corePlugins: PropTypes.arrayOf(pluginType),
    coreSchema:  schemaPropType,
    placeholder: PropTypes.string,
    plugins:     PropTypes.arrayOf(pluginType),
    schema:      schemaPropType,
    spellCheck:  PropTypes.bool,

    toolbarClassName: PropTypes.string,

    onHtmlChange: PropTypes.func,

    defaultHtml: PropTypes.string,
    html:        PropTypes.string,
  }
}
