import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../src/components/WikiEditor'

const HTML = `
  <table>
    pewp
  </table>
  <td>pewp</td>
`

class Example extends React.Component {
  state = { html: HTML }

  handleHtmlChange = html => this.setState({ html })

  render = () => (
    <div>
      <WikiEditor
        html={this.state.html}
        onHtmlChange={this.handleHtmlChange}
      />
      <textarea value={this.state.html} />
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('application'))
