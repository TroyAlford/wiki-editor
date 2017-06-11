/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import React from 'react'
import { Map } from 'immutable'

export default (Tag, {
  attributes = {},
  children = [],
  data = new Map(),
  isVoid = false,
} = {}) => {
  if (!Tag || typeof Tag !== 'string') throw new Error('Tag is required')

  const dataMap =
    (data instanceof Map && data) ||
    (typeof data === 'object' && new Map(data)) ||
    new Map()

  const style = dataMap.get('style') || {}
  const className = dataMap.get('className') || undefined

  if (isVoid) return <Tag {...attributes} {...{ className, style }} />
  return <Tag {...attributes} {...{ className, style }}>{children}</Tag>
}
