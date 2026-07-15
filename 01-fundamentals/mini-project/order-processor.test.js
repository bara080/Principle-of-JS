// Module 01 — mini-project — tests
// Run: node --test 01-fundamentals/mini-project/order-processor.test.js

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { processOrder, _internals } from './order-processor.js'

const FIXED_NOW = () => '2026-07-13T12:00:00.000Z'

function baseOrder(overrides = {}) {
  return {
    customer: {
      id: 'cus_123',
      email: 'ada@example.com',
      role: 'customer',
    },
    products: [
      { sku: 'COFFEE-01', priceCents: 450, quantity: 2 }, // 900
      { sku: 'BAGEL-01',  priceCents: 300, quantity: 1 }, // 300
    ],
    taxRateBps: 875, // 8.75%
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
describe('processOrder — happy path', () => {
  test('computes subtotal, tax, and total from a valid order', () => {
    const result = processOrder(baseOrder(), { now: FIXED_NOW })

    assert.equal(result.ok, true)
    assert.equal(result.data.subtotalCents, 1200)
    assert.equal(result.data.discountCents, 0)
    // 1200 * 875 / 10000 = 105
    assert.equal(result.data.taxCents, 105)
    assert.equal(result.data.totalCents, 1305)
    assert.equal(result.data.itemCount, 3)
    assert.equal(result.data.currency, 'USD')
    assert.equal(result.data.receiptedAt, '2026-07-13T12:00:00.000Z')
    assert.equal(result.data.customer.email, 'ada@example.com')
  })

  test('normalizes email to trimmed lowercase', () => {
    const result = processOrder(
      baseOrder({ customer: { id: 'x', email: '  Ada@Example.COM ', role: 'customer' } }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, true)
    assert.equal(result.data.customer.email, 'ada@example.com')
  })

  test('handles missing tax rate (treats as 0)', () => {
    const result = processOrder(baseOrder({ taxRateBps: undefined }), { now: FIXED_NOW })
    assert.equal(result.ok, true)
    assert.equal(result.data.taxCents, 0)
    assert.equal(result.data.totalCents, 1200)
  })

  test('handles missing optional shipping without error', () => {
    const result = processOrder(baseOrder({ shipping: undefined }), { now: FIXED_NOW })
    assert.equal(result.ok, true)
  })
})

// ---------------------------------------------------------------------------
describe('processOrder — discounts', () => {
  test('staff can apply a percent discount', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 's1', email: 's@example.com', role: 'staff' },
        discount: { code: 'WELCOME10', percent: 10 },
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, true)
    // 1200 - 120 = 1080; tax: 1080 * 875 / 10000 = 94.5 → 95 (banker's rounding? no — round half up)
    assert.equal(result.data.subtotalCents, 1200)
    assert.equal(result.data.discountCents, 120)
    assert.equal(result.data.taxCents, 95)
    assert.equal(result.data.totalCents, 1175)
  })

  test('admin can apply a discount', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 'a1', email: 'a@example.com', role: 'admin' },
        discount: { code: 'VIP', percent: 100 },
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, true)
    assert.equal(result.data.discountCents, 1200)
    assert.equal(result.data.taxCents, 0)
    assert.equal(result.data.totalCents, 0)
  })

  test('customer cannot apply a discount', () => {
    const result = processOrder(
      baseOrder({ discount: { code: 'HAX', percent: 90 } }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'discount'))
  })

  test('rejects invalid discount percent', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 's1', email: 's@example.com', role: 'staff' },
        discount: { code: 'BAD', percent: 150 },
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'discount.percent'))
  })
})

// ---------------------------------------------------------------------------
describe('processOrder — permissions', () => {
  test('guest cannot spend more than the guest cap', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 'g1', email: 'g@example.com', role: 'guest' },
        products: [{ sku: 'BIG', priceCents: 20_000, quantity: 1 }],
        taxRateBps: 0,
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'total'))
  })

  test('guest can spend under the cap', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 'g1', email: 'g@example.com', role: 'guest' },
        products: [{ sku: 'SMALL', priceCents: 500, quantity: 2 }],
        taxRateBps: 0,
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, true)
    assert.equal(result.data.totalCents, 1000)
  })

  test('customer cannot spend more than customer cap', () => {
    const result = processOrder(
      baseOrder({
        products: [{ sku: 'HUGE', priceCents: 600_000, quantity: 1 }],
        taxRateBps: 0,
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'total'))
  })

  test('admin has no spend cap', () => {
    const result = processOrder(
      baseOrder({
        customer: { id: 'a1', email: 'a@example.com', role: 'admin' },
        products: [{ sku: 'YACHT', priceCents: 100_000_00, quantity: 1 }],
        taxRateBps: 0,
      }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, true)
  })
})

// ---------------------------------------------------------------------------
describe('processOrder — validation collects all errors', () => {
  test('null input returns a single error', () => {
    const result = processOrder(null, { now: FIXED_NOW })
    assert.equal(result.ok, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].field, 'input')
  })

  test('missing customer, empty products, bad tax — all reported', () => {
    const result = processOrder({ products: [], taxRateBps: -5 }, { now: FIXED_NOW })
    assert.equal(result.ok, false)
    const fields = result.errors.map((e) => e.field)
    assert.ok(fields.includes('customer'))
    assert.ok(fields.includes('products'))
    assert.ok(fields.includes('taxRateBps'))
  })

  test('invalid email is caught', () => {
    const result = processOrder(
      baseOrder({ customer: { id: 'x', email: 'nope', role: 'customer' } }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'customer.email'))
  })

  test('invalid role is caught', () => {
    const result = processOrder(
      baseOrder({ customer: { id: 'x', email: 'a@b.c', role: 'superuser' } }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'customer.role'))
  })

  test('non-integer price is caught', () => {
    const result = processOrder(
      baseOrder({ products: [{ sku: 'X', priceCents: 4.5, quantity: 1 }] }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'products[0].priceCents'))
  })

  test('quantity over 99 is caught', () => {
    const result = processOrder(
      baseOrder({ products: [{ sku: 'X', priceCents: 100, quantity: 100 }] }),
      { now: FIXED_NOW },
    )
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((e) => e.field === 'products[0].quantity'))
  })

  test('does not throw on hostile shapes', () => {
    // Injection attempt via prototype-polluted-looking input.
    const hostile = JSON.parse('{"__proto__": {"role": "admin"}, "products": []}')
    const result = processOrder(hostile, { now: FIXED_NOW })
    assert.equal(result.ok, false)
    // Prototype should not have been mutated on {} — spot check.
    assert.equal({}.role, undefined)
  })
})

// ---------------------------------------------------------------------------
describe('processOrder — determinism', () => {
  test('receiptedAt comes from the injected now function', () => {
    const fixed = () => '2020-01-01T00:00:00.000Z'
    const result = processOrder(baseOrder(), { now: fixed })
    assert.equal(result.data.receiptedAt, '2020-01-01T00:00:00.000Z')
  })

  test('default now returns an ISO string', () => {
    const result = processOrder(baseOrder())
    assert.equal(result.ok, true)
    assert.match(
      result.data.receiptedAt,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    )
  })
})

// ---------------------------------------------------------------------------
describe('_internals — computation primitives', () => {
  test('computeSubtotal multiplies price × quantity', () => {
    const cents = _internals.computeSubtotal([
      { priceCents: 500, quantity: 2 },
      { priceCents: 250, quantity: 3 },
    ])
    assert.equal(cents, 1750)
  })

  test('computeDiscount uses integer floor', () => {
    // 999 * 10 / 100 = 99.9 → 99
    assert.equal(_internals.computeDiscount(999, { percent: 10 }), 99)
    assert.equal(_internals.computeDiscount(1000, null), 0)
  })

  test('computeTax rounds half up', () => {
    // 1000 * 875 / 10000 = 87.5 → 88
    assert.equal(_internals.computeTax(1000, 875), 88)
    assert.equal(_internals.computeTax(1000, 0), 0)
  })

  test('isValidEmailShape rejects known-bad inputs', () => {
    assert.equal(_internals.isValidEmailShape(''), false)
    assert.equal(_internals.isValidEmailShape('nope'), false)
    assert.equal(_internals.isValidEmailShape('a@b@c'), false)
    assert.equal(_internals.isValidEmailShape('a@b'), true)
    assert.equal(_internals.isValidEmailShape(null), false)
  })
})
