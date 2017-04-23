import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WikiEditor from '../../src/components/WikiEditor'

class Example extends React.Component {
  state = { html: undefined }

  handleHtmlChange = html => this.setState({ html })

  render = () => (
    <div>
      <WikiEditor onHtmlChange={this.handleHtmlChange} />
      <textarea value={this.state.html} />
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('application'))
