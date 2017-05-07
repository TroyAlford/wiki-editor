import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../src/components/WikiEditor'

const HTML = `
  <table><tr><td>Pewp</td></tr><tr><td>Poop</td></tr><tr><td>Haha!</td></tr></table>
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
