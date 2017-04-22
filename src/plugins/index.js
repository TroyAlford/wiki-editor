import * as BasicMarks from './BasicMarks'

const PLUGINS = [
  BasicMarks,
]

export const plugins = PLUGINS.reduce(
  (all, p) => [...all, ...(p.plugins || [p])]
, [])
export const rules = PLUGINS.reduce(
  (all, p) => [...all, ...(p.rules || [])]
, [])
export const schema = PLUGINS.reduce(
  (all, p) => ({
    marks: { ...all.marks, ...(p.schema.marks || {}) },
    nodes: { ...all.nodes, ...(p.schema.nodes || {}) },
  })
, { marks: {}, nodes: {} })
export const toolbar = PLUGINS.reduce(
  (all, p) => [...all, ...(p.toolbar || [])]
, [])
