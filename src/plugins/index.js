import Alignment from './Alignment'
import Anchor from './Anchor'
import AutoReplacers from './AutoReplacers'
import Blockquote from './Blockquote'
import Div from './Div'
import Header from './Header'
import HorizontalRule from './HorizontalRule'
import Paragraph from './Paragraph'
import Span from './Span'
import Table from './Table'
import TextDecorators from './TextDecorators'

const PLUGINS = [
  Anchor,
  Header,
  TextDecorators,
  Alignment,
  Table,
  Blockquote,
  Div,
  Paragraph,
  Span,
  HorizontalRule,
  ...AutoReplacers,
]

export const schema = PLUGINS
  .filter(plugin => plugin.schema)
  .reduce((all, plugin) => ({
    marks: { ...all.marks, ...(plugin.schema.marks || {}) },
    nodes: { ...all.nodes, ...(plugin.schema.nodes || {}) },
    rules: [...all.rules, ...(plugin.schema.rules || [])],
  }), { marks: {}, nodes: {}, rules: [] })

export const serializers = PLUGINS
  .filter(plugin => Array.isArray(plugin.serializers))
  .reduce((all, plugin) => [...all, ...plugin.serializers], [])

export default PLUGINS
