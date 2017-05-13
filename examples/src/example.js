import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../src/components/WikiEditor'

window.React = React
window.ReactDOM = ReactDOM

const HTML = `
  <p>This is some stuff with a [test](text) link put in the middle.</p>
  <a href="foo">Bar</a>
`

class Example extends React.Component {
  state = { html: HTML }

  handleHtmlChange = html => this.setState({ html })

  render = () => (
    <div>
      <WikiEditor html={HTML} onHtmlChange={this.handleHtmlChange} />
      <textarea value={this.state.html} />
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('application'))
