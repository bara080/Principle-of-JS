import { test } from 'node:test'
import assert from 'node:assert/strict'

import { ok, err, isOk, wrap, AppError, NotFoundError } from './index.js'

test('ok / err / isOk', { skip: 'implement first' }, () => {
  const good = ok(42)
  assert.equal(isOk(good), true)
  assert.equal(good.data, 42)

  const bad = err(new NotFoundError('nope'))
  assert.equal(isOk(bad), false)
  assert.ok(bad.error instanceof NotFoundError)
})

test('wrap converts throwing code to Result', { skip: 'implement first' }, async () => {
  const good = await wrap(async () => 'hi')
  assert.equal(isOk(good), true)

  const bad = await wrap(async () => { throw new AppError('boom') })
  assert.equal(isOk(bad), false)
})
