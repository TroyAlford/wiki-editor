import Paragraph from './Paragraph'
import Table from './Table'
import TextDecorators from './TextDecorators'

const PLUGINS = [
  Paragraph,
  TextDecorators,
  Table,
]

export const serializers = PLUGINS
  .filter(plugin => Array.isArray(plugin.serializers))
  .reduce((all, plugin) => [...all, ...plugin.serializers], [])

export const schema = PLUGINS
  .filter(plugin => plugin.schema)
  .reduce((all, plugin) => ({
    marks: { ...all.marks, ...(plugin.schema.marks || {}) },
    nodes: { ...all.nodes, ...(plugin.schema.nodes || {}) },
    rules: [...all.rules, ...(plugin.schema.rules || [])],
  }), { marks: {}, nodes: {}, rules: [] })

export const toolbarButtons = PLUGINS
  .filter(p => Array.isArray(p.toolbarButtons))
  .reduce((all, p) => [...all, ...p.toolbarButtons], [])

export default PLUGINS
