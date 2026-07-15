// Module 02 — mini-project — tests
// Run: node --test 02-functions/mini-project/index.test.js

import { test } from 'node:test'
import assert from 'node:assert/strict'

import * as toolkit from './index.js'

// While the mini-project is unimplemented, tests are marked as skipped so the
// suite passes. Remove `{ skip: true }` from each test as you implement it.

test('once returns the first result on every call', { skip: 'implement first' }, () => {
  let count = 0
  const inc = toolkit.once(() => ++count)
  assert.equal(inc(), 1)
  assert.equal(inc(), 1)
  assert.equal(count, 1)
})

test('memoize caches by args', { skip: 'implement first' }, () => {
  let calls = 0
  const slow = toolkit.memoize((n) => (calls++, n * 2))
  assert.equal(slow(3), 6)
  assert.equal(slow(3), 6)
  assert.equal(calls, 1)
})

test('pipe applies functions left-to-right', { skip: 'implement first' }, () => {
  const p = toolkit.pipe((x) => x + 1, (x) => x * 2)
  assert.equal(p(3), 8)
})

test('compose applies functions right-to-left', { skip: 'implement first' }, () => {
  const c = toolkit.compose((x) => x + 1, (x) => x * 2)
  assert.equal(c(3), 7)
})
