import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { computeStreak } from '../src/domain/streak.js'
import { addDays } from '../src/domain/date.js'

function entries(dates, count = 1) {
  return dates.map((date, i) => ({ id: `e${i}`, habitId: 'h1', date, count }))
}

describe('computeStreak', () => {
  test('empty entries → zero', () => {
    const result = computeStreak({ target: 1 }, [], '2026-07-14')
    assert.equal(result.currentStreak, 0)
    assert.equal(result.longestStreak, 0)
    assert.equal(result.completionRate, 0)
  })

  test('single day → current streak 1', () => {
    const result = computeStreak({ target: 1 }, entries(['2026-07-14']), '2026-07-14')
    assert.equal(result.currentStreak, 1)
    assert.equal(result.longestStreak, 1)
  })

  test('consecutive days → longest reflects run', () => {
    const dates = ['2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13', '2026-07-14']
    const result = computeStreak({ target: 1 }, entries(dates), '2026-07-14')
    assert.equal(result.currentStreak, 5)
    assert.equal(result.longestStreak, 5)
  })

  test('gap breaks the streak', () => {
    const dates = ['2026-07-10', '2026-07-11', '2026-07-13', '2026-07-14']
    const result = computeStreak({ target: 1 }, entries(dates), '2026-07-14')
    assert.equal(result.currentStreak, 2)
    assert.equal(result.longestStreak, 2)
  })

  test('target > 1 requires that many entries per day', () => {
    const dates = ['2026-07-13', '2026-07-13', '2026-07-14', '2026-07-14']
    const result = computeStreak({ target: 2 }, entries(dates, 1), '2026-07-14')
    assert.equal(result.currentStreak, 2)
  })

  test('completion rate over last 30 days', () => {
    // 15 hits out of 30 = 0.5
    const dates = Array.from({ length: 15 }, (_, i) => addDays('2026-06-15', i))
    const result = computeStreak({ target: 1 }, entries(dates), '2026-07-14')
    assert.ok(Math.abs(result.completionRate - 0.5) < 0.001)
  })
})
