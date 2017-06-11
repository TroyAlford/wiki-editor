import React from 'react'
import renderStyled from './renderStyled'

jest.unmock('./renderStyled')

describe('renderStyled', () => {
	it('requires Tag', () => {
		expect(() => renderStyled()).toThrow()
	})

	it('only requires Tag', () => {
		const rendered = renderStyled('h1')
		expect(rendered.props.className).toEqual(undefined)
		expect(rendered.props.children).toEqual([])
		expect(rendered.props.style).toEqual({})
	})

	it('handles data as object, map, or missing', () => {
		const data = { className: 'foo bar' }
    const dataAsMap = new Map(Object.entries(data))
		expect(renderStyled('p', { data }).props.className).toEqual('foo bar')
		expect(renderStyled('p', { data: dataAsMap }).props.className).toEqual('foo bar')
		expect(renderStyled('p', { data: undefined }).props.className).toEqual(undefined)
	})

  it('handles children', () => {
    const child = <div key="1" className="blah">Test</div>
    expect(renderStyled('p', { children: [child] }).props.children).toEqual([child])
  })

  it('handles arbitrary attributes', () => {
    const attributes = { foo: 'bar', href: 'url' }
    const rendered = renderStyled('p', { attributes })
    expect(rendered.props.foo).toEqual('bar')
    expect(rendered.props.href).toEqual('url')
  })
})
