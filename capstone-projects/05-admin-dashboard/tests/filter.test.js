import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { applyFilter, aggregate, normalizeFilter } from '../src/filter.js'
import { generateOrders } from '../src/api.js'

const sample = [
  { id: '1', customer: 'Ada Lovelace',   status: 'paid',      totalCents: 5000, createdAt: '2026-06-01' },
  { id: '2', customer: 'Grace Hopper',   status: 'refunded',  totalCents: 1500, createdAt: '2026-06-02' },
  { id: '3', customer: 'Linus Torvalds', status: 'paid',      totalCents: 9000, createdAt: '2026-06-03' },
  { id: '4', customer: 'Ada Lovelace',   status: 'pending',   totalCents: 2500, createdAt: '2026-06-04' },
]

describe('applyFilter', () => {
  test('free text matches customer (case-insensitive)', () => {
    const out = applyFilter(sample, { q: 'ada' })
    assert.equal(out.length, 2)
    assert.ok(out.every((o) => o.customer.toLowerCase().includes('ada')))
  })

  test('status filter', () => {
    const out = applyFilter(sample, { status: 'paid' })
    assert.equal(out.length, 2)
    assert.ok(out.every((o) => o.status === 'paid'))
  })

  test('range filter', () => {
    const out = applyFilter(sample, { minCents: 2000, maxCents: 6000 })
    assert.deepEqual(out.map((o) => o.id), ['1', '4'])
  })

  test('sort — single key desc', () => {
    const out = applyFilter(sample, { sort: ['totalCents:desc'] })
    assert.deepEqual(out.map((o) => o.id), ['3', '1', '4', '2'])
  })

  test('sort — multi-key', () => {
    const out = applyFilter(sample, { sort: ['status:asc', 'totalCents:desc'] })
    // status asc: paid, paid, pending, refunded; within paid: 9000, 5000
    assert.deepEqual(out.map((o) => o.id), ['3', '1', '4', '2'])
  })

  test('ignores unknown status', () => {
    const out = applyFilter(sample, { status: 'gibberish' })
    assert.equal(out.length, sample.length)
  })
})

describe('aggregate', () => {
  test('totals', () => {
    const stats = aggregate(sample)
    assert.equal(stats.count, 4)
    assert.equal(stats.totalCents, 5000 + 1500 + 9000 + 2500)
    assert.equal(stats.byStatus.paid, 2)
  })
})

describe('normalizeFilter', () => {
  test('drops NaN numeric bounds', () => {
    const f = normalizeFilter({ minCents: NaN, maxCents: 'x' })
    assert.equal(f.minCents, null)
    assert.equal(f.maxCents, null)
  })
})

describe('performance sanity', () => {
  test('filters 10k orders in <200ms', () => {
    const large = generateOrders(10_000)
    const t0 = performance.now()
    const out = applyFilter(large, { status: 'paid', sort: ['totalCents:desc'] })
    const elapsed = performance.now() - t0
    assert.ok(out.length > 0)
    assert.ok(elapsed < 200, `too slow: ${elapsed.toFixed(1)}ms`)
  })
})
