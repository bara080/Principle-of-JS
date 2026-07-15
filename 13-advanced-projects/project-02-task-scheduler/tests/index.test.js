import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createScheduler } from '../src/index.js'

test('runs enqueued tasks by priority', { skip: 'implement first' }, async () => {
  const scheduler = createScheduler()
  const order = []
  await scheduler.enqueue(() => order.push('low'), { priority: 'low' })
  await scheduler.enqueue(() => order.push('high'), { priority: 'high' })
  await scheduler.drain()
  assert.deepEqual(order, ['high', 'low'])
})
