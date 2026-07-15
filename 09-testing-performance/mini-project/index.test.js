import { test, mock } from 'node:test'
import assert from 'node:assert/strict'

import { debounce, throttle } from './index.js'

test('debounce fires once after silence', { skip: 'implement first' }, () => {
  mock.timers.enable({ apis: ['setTimeout'] })
  let calls = 0
  const fn = debounce(() => calls++, 100)
  fn(); fn(); fn()
  mock.timers.tick(99)
  assert.equal(calls, 0)
  mock.timers.tick(1)
  assert.equal(calls, 1)
  mock.timers.reset()
})

test('throttle fires immediately then locks', { skip: 'implement first' }, () => {
  mock.timers.enable({ apis: ['setTimeout'] })
  let calls = 0
  const fn = throttle(() => calls++, 100)
  fn(); fn(); fn()
  assert.equal(calls, 1)
  mock.timers.tick(100)
  fn()
  assert.equal(calls, 2)
  mock.timers.reset()
})
