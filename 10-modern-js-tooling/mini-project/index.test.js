import { test } from 'node:test'
import assert from 'node:assert/strict'

import { hello } from './index.js'

test('hello returns a greeting', () => {
  assert.equal(hello('Ada'), 'hello, Ada')
})
