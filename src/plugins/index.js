import BasicMarksPlugin from './BasicMarksPlugin'
import TablePlugin from './TablePlugin'

const PLUGINS = [
  BasicMarksPlugin,
  TablePlugin,
]

export const serializers = PLUGINS.filter(p => Array.isArray(p.serializers)).reduce(
  (all, p) => [...all, ...p.serializers]
, [])

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
