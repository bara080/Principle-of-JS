import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { md, parse, render } from '../src/index.js'

describe('parse', () => {
  test('tokenizes headings and paragraphs', () => {
    const tokens = parse('# Title\n\nHello world.')
    assert.deepEqual(tokens, [
      { type: 'heading', level: 1, text: 'Title' },
      { type: 'paragraph', text: 'Hello world.' },
    ])
  })

  test('handles fenced code with language', () => {
    const tokens = parse('```js\nconst x = 1\n```')
    assert.equal(tokens[0].type, 'code')
    assert.equal(tokens[0].lang, 'js')
    assert.equal(tokens[0].text, 'const x = 1')
  })

  test('handles unordered and ordered lists', () => {
    const tokens = parse('- a\n- b\n\n1. one\n2. two')
    assert.equal(tokens[0].type, 'list')
    assert.equal(tokens[0].ordered, false)
    assert.deepEqual(tokens[0].items, ['a', 'b'])
    assert.equal(tokens[1].ordered, true)
  })
})

describe('render', () => {
  test('escapes HTML by default', () => {
    const out = render(parse('a <b> & "c"'))
    assert.match(out, /&lt;b&gt;/)
    assert.match(out, /&amp;/)
  })

  test('bold and italic', () => {
    const out = render(parse('**bold** and *italic*'))
    assert.match(out, /<strong>bold<\/strong>/)
    assert.match(out, /<em>italic<\/em>/)
  })

  test('inline code preserved', () => {
    const out = render(parse('use `const` here'))
    assert.match(out, /<code>const<\/code>/)
  })

  test('links', () => {
    const out = render(parse('[MDN](https://mdn.io)'))
    assert.match(out, /<a href="https:\/\/mdn\.io">MDN<\/a>/)
  })
})

describe('md — end-to-end', () => {
  test('golden path', async () => {
    const source = `# Hi\n\nA paragraph with **bold**.\n\n- item 1\n- item 2\n`
    const html = await md(source)
    assert.match(html, /<h1>Hi<\/h1>/)
    assert.match(html, /<p>A paragraph with <strong>bold<\/strong>\.<\/p>/)
    assert.match(html, /<ul>/)
  })

  test('plugin transforms tokens', async () => {
    const uppercaseHeadings = ({ tokens }) =>
      tokens.map((t) => t.type === 'heading' ? { ...t, text: t.text.toUpperCase() } : t)
    const html = await md('# hello', { plugins: [uppercaseHeadings] })
    assert.match(html, /<h1>HELLO<\/h1>/)
  })
})
