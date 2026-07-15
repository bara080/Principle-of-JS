// Module 03 — mini-project — tests
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { Customer, Product, Invoice } from './index.js'

test('Customer validates email on construction', { skip: 'implement first' }, () => {
  assert.throws(() => new Customer('c1', 'nope', 'customer'), /email/)
})

test('Product rejects non-integer prices', { skip: 'implement first' }, () => {
  assert.throws(() => new Product('p1', 'Coffee', 4.5), /price/)
})

test('Invoice totals correctly', { skip: 'implement first' }, () => {
  const c = new Customer('c1', 'ada@example.com', 'customer')
  const p = new Product('p1', 'Coffee', 450)
  const inv = new Invoice(c)
  inv.addLine(p, 2)
  assert.equal(inv.totalCents, 900)
})
