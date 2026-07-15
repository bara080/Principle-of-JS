import { test } from 'node:test'
import assert from 'node:assert/strict'

import { s } from './index.js'

test('string schema — happy path', { skip: 'implement first' }, () => {
  const result = s.string().parse('hello')
  assert.equal(result.ok, true)
  assert.equal(result.data, 'hello')
})

test('object schema — collects field errors', { skip: 'implement first' }, () => {
  const schema = s.object({ name: s.string(), age: s.number() })
  const result = schema.parse({ name: 42, age: 'x' })
  assert.equal(result.ok, false)
  assert.equal(result.errors.length, 2)
})
