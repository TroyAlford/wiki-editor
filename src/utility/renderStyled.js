/* eslint-disable react/react-in-jsx-scope,react/prop-types */
import React from 'react'

export default (Tag, { data = new Map(), children = [], attributes = {} } = {}) => {
  if (!Tag || typeof Tag !== 'string') throw new Error('Tag is required')

  let dataMap;
  if (data instanceof Map)
    dataMap = data
  else if (typeof data === 'object')
    dataMap = new Map(Object.entries(data))
  else
    dataMap = new Map()
  // const dataMap = data instanceof Map ? data :
  //                 typeof data === 'object' ? new Map(Object.entries(data)) :
  //                 new Map()

  const style = dataMap.get('style') || {}
  const className = dataMap.get('className') || undefined

  return <Tag {...attributes } {...{ className, style }}>{children || []}</Tag>
}
