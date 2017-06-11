import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../src/WikiEditor'

window.React = React
window.ReactDOM = ReactDOM

const HTML = `
<h1 class="header-class" style="color: red;">Header 1</h1>\
<p>This is some stuff with a [test](text) link put in the middle.</p>\
<p><a href="foo">Bar</a></p>\
<p><a href="with" class="class names">Test</a></p>\
`

class Example extends React.Component {
  state = { html: HTML }

  handleHtmlChange = html => this.setState({ html })

  render = () => (
    <div>
      <WikiEditor html={HTML} onHtmlChange={this.handleHtmlChange} />
      <textarea readOnly value={this.state.html} />
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('application'))
