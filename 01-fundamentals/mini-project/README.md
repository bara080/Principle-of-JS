# Mini-Project — Order Processor

A production-style order processor built with **only** the concepts from
Module 01. No frameworks, no dependencies. Pure Node.js.

## What it does

Takes an order request from a client (assume an untrusted source like an
Express handler) and returns a structured result:

- **Validates** every field of the order (products, customer, discount, permissions).
- **Computes** subtotal, tax, discount, and final total — all in **integer cents**
  to avoid floating-point bugs.
- **Handles missing optional data** (no discount code, no shipping instructions,
  no coupon, no `phone`).
- **Checks permissions** — only certain roles can place orders over a threshold,
  and only staff can apply arbitrary discounts.
- **Never throws** on user input. Returns `{ ok: true, data }` or
  `{ ok: false, errors }`.

## Files

```
mini-project/
├── README.md
├── order-processor.js       — the module
└── order-processor.test.js  — Node.js built-in test runner
```

## Running

```bash
# Run the test suite
node --test 01-fundamentals/mini-project/order-processor.test.js

# Or via npm (runs all module tests)
npm test
```

## Requirements

Every one of these is exercised by a test. Get them all green.

### Input contract

```js
processOrder({
  customer: {
    id: 'cus_123',
    email: 'ada@example.com',
    role: 'customer',            // 'guest' | 'customer' | 'staff' | 'admin'
  },
  products: [
    { sku: 'COFFEE-01', priceCents: 450, quantity: 2 },
    { sku: 'BAGEL-01',  priceCents: 300, quantity: 1 },
  ],
  discount: {                    // optional
    code: 'WELCOME10',
    percent: 10,                 // integer 1-100
  },
  taxRateBps: 875,               // 8.75% — basis points, integers only
  shipping: {                    // optional
    address: '123 Main St',
    instructions: null,
  },
})
```

### Output contract

**Success:**

```js
{
  ok: true,
  data: {
    subtotalCents: 1200,
    discountCents: 120,
    taxCents: 94,               // Math.round((subtotal - discount) * taxRateBps / 10000)
    totalCents: 1174,
    itemCount: 3,
    currency: 'USD',
    receiptedAt: '2026-07-13T12:00:00.000Z',
    customer: { id, email, role },
  }
}
```

**Failure:**

```js
{
  ok: false,
  errors: [
    { field: 'customer.email', message: 'invalid email' },
    { field: 'products',       message: 'at least one product is required' },
  ]
}
```

Failures collect **all** errors, not just the first — good UX.

### Validation rules

- `customer` must be an object with a valid role and email shape.
- `customer.role` must be one of `guest`, `customer`, `staff`, `admin`.
- `products` must be a non-empty array. Each product must have a non-empty
  `sku`, a positive integer `priceCents`, and a positive integer `quantity` ≤ 99.
- `taxRateBps` must be a non-negative integer ≤ 10000 (100%). Missing → 0.
- `discount` is optional. If present, `code` is a string and `percent` is an
  integer 1–100.

### Permission rules

- `guest` can order up to `$100.00` (10000 cents). Above that → error.
- `customer` can order up to `$5000.00`.
- `staff` and `admin` have no cap.
- Only `staff` and `admin` can apply a discount. Others → error.

### Determinism

`receiptedAt` comes from a `now` function passed via options. Default to
`() => new Date().toISOString()`. Tests inject a fixed value.

## What you'll practice

- `const` / `let` discipline (no `var`).
- Guard-clause validation with error accumulation.
- Integer-cents arithmetic — no floats.
- `??` for defaulted optional fields.
- `?.` for defensive traversal.
- Strict equality for role checks.
- `Array.prototype.reduce` for aggregation.
- Return-errors-as-data pattern.

## Extension ideas

Once tests are green:

- Add gift cards (partial payment, cap at total).
- Add multi-currency support (validate ISO codes, keep amounts in minor units).
- Add per-product tax exemption flags.
- Emit a `receipt` object structured for a PDF renderer.
