import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createCounter } from '../src/counter.js'

test('starts at initial and increments by step', { skip: 'implement first' }, () => {
  const c = createCounter({ initial: 5, step: 2 })
  assert.equal(c.read(), 5)
  c.increment()
  assert.equal(c.read(), 7)
  c.decrement()
  assert.equal(c.read(), 5)
})

test('subscribers fire on change and unsubscribe cleanly', { skip: 'implement first' }, () => {
  const c = createCounter()
  const values = []
  const off = c.subscribe((v) => values.push(v))
  c.increment()
  c.increment()
  off()
  c.increment()
  assert.deepEqual(values, [1, 2])
})
