/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import React from 'react'
import { Map } from 'immutable'

export default (Tag, { data = new Map(), children = [], attributes = {} } = {}) => {
  if (!Tag || typeof Tag !== 'string') throw new Error('Tag is required')

  const dataMap =
    (data instanceof Map && data) ||
    (typeof data === 'object' && new Map(data)) ||
    new Map()

  const style = dataMap.get('style') || {}
  const className = dataMap.get('className') || undefined

  return <Tag {...attributes} {...{ className, style }}>{children || []}</Tag>
}
