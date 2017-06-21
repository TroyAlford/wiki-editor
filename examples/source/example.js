import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../source/WikiEditor'

window.React = React
window.ReactDOM = ReactDOM

const HTML = `
<h1 class="header-class" style="color: red;">Header 1</h1>
<p>This is some stuff with a [test](text) link put in the middle.</p>
<ul><li>List Item</li></ul>
<table class="blah">
  <tr><th colspan="2"><img src="http://lorempixel.com/100/100/" /></th></tr>
  <tr><td>Left</td><td>Right</td></tr>
</table>
<p><a href="foo" class="class names">Bar</a></p>
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
