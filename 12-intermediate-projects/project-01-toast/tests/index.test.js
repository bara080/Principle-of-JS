import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createStore } from '../src/index.js'

test('show/dismiss/clear', { skip: 'implement first' }, () => {
  const store = createStore()
  const a = store.show({ message: 'a' })
  const b = store.show({ message: 'b' })
  assert.equal(store.snapshot().length, 2)
  store.dismiss(a)
  assert.equal(store.snapshot().length, 1)
  assert.equal(store.snapshot()[0].id, b)
  store.clear()
  assert.equal(store.snapshot().length, 0)
})
