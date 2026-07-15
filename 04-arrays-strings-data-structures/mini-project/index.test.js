import { test } from 'node:test'
import assert from 'node:assert/strict'

import { LRU } from './index.js'

test('rejects invalid max', { skip: 'implement first' }, () => {
  assert.throws(() => new LRU(0), TypeError)
  assert.throws(() => new LRU(-1), TypeError)
})

test('evicts least recently used', { skip: 'implement first' }, () => {
  const lru = new LRU(2)
  lru.set('a', 1)
  lru.set('b', 2)
  lru.get('a')          // 'a' now most recent
  lru.set('c', 3)       // 'b' evicted
  assert.equal(lru.has('b'), false)
  assert.equal(lru.get('a'), 1)
  assert.equal(lru.get('c'), 3)
})

test('has() does not refresh recency', { skip: 'implement first' }, () => {
  const lru = new LRU(2)
  lru.set('a', 1)
  lru.set('b', 2)
  lru.has('a')          // no refresh
  lru.set('c', 3)       // 'a' evicted
  assert.equal(lru.has('a'), false)
})
