import { test } from 'node:test'
import assert from 'node:assert/strict'

import { assess } from '../src/index.js'

test('scores obviously weak passwords low', { skip: 'implement first' }, () => {
  assert.equal(assess('password').score, 0)
})

test('scores long varied passwords high', { skip: 'implement first' }, () => {
  assert.ok(assess('correct-horse-battery-staple!47').score >= 3)
})

test('penalizes passwords containing user info', { skip: 'implement first' }, () => {
  const result = assess('ada-lovelace-2020', { userInfo: ['ada', 'lovelace'] })
  assert.ok(result.score <= 2)
})
