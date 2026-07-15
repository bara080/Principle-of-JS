// Module 01 — fundamentals — exercises
// Run: node 01-fundamentals/exercises.js
//
// Do these in order. Delete `throw new Error('TODO')` as you implement each one.
// When you finish a tier, run this file — the assertions at the bottom will
// tell you which exercises pass. Peek at solutions.js only after you've tried.
//
// TIERS
//   Beginner       — 1–3    (syntax, types, coercion)
//   Intermediate   — 4–6    (operators, control flow, defensive reads)
//   Production     — 7–9    (validation, aggregation, config)
//   Challenge      — 10     (mini system: rate-limited quota tracker)

import assert from 'node:assert/strict'

// ---------------------------------------------------------------------------
// BEGINNER
// ---------------------------------------------------------------------------

// 1. isValidEmailShape(value)
//    Return true iff `value` is a non-empty string that contains exactly one
//    "@" with at least one character on either side. Do NOT use regex here —
//    the point is practicing type checks and string methods.
export function isValidEmailShape(_value) {
  throw new Error('TODO 1: isValidEmailShape')
}

// 2. safeParseInt(value, fallback)
//    Coerce `value` to an integer using base 10. Return `fallback` when the
//    result is not finite. Should handle: '42' → 42, ' 42 ' → 42, '12px' → 12,
//    'abc' → fallback, null → fallback, undefined → fallback, NaN → fallback.
export function safeParseInt(_value, _fallback = 0) {
  throw new Error('TODO 2: safeParseInt')
}

// 3. describeValue(value)
//    Return a string tag: 'null', 'undefined', 'nan', 'array', 'object',
//    'string', 'number', 'boolean', 'bigint', 'symbol', 'function'.
//    Order matters — check null before object, NaN before number.
export function describeValue(_value) {
  throw new Error('TODO 3: describeValue')
}

// ---------------------------------------------------------------------------
// INTERMEDIATE
// ---------------------------------------------------------------------------

// 4. pickDefault(value, fallback)
//    Return `value` unless it is null or undefined, in which case `fallback`.
//    Do NOT collapse 0, '', or false to the fallback. (Yes, this is the ?? operator —
//    implement it without using ?? to prove you understand the rule.)
export function pickDefault(_value, _fallback) {
  throw new Error('TODO 4: pickDefault')
}

// 5. deepGet(object, path)
//    Given an object and a dot-separated path ('shipping.address.city'),
//    return the value at that path or undefined if any segment is missing.
//    Should not throw on null/undefined intermediates.
//    deepGet({ a: { b: { c: 1 } } }, 'a.b.c') // 1
//    deepGet({ a: null }, 'a.b.c')            // undefined
//    deepGet(null, 'a')                       // undefined
export function deepGet(_object, _path) {
  throw new Error('TODO 5: deepGet')
}

// 6. classifyOrder(order)
//    Return a string classifying the order using guard clauses only (no nested
//    if/else). Rules, checked in this order:
//      - order is null/undefined                       → 'invalid'
//      - order.status is not one of the allowed values → 'invalid'
//      - order.status === 'cancelled'                  → 'cancelled'
//      - order.status === 'refunded'                   → 'refunded'
//      - order.status === 'paid' && total >= 10000     → 'high-value'
//      - order.status === 'paid'                       → 'standard'
//      - order.status === 'pending'                    → 'pending'
//    Allowed statuses: 'pending', 'paid', 'refunded', 'cancelled'.
//    `total` is in integer cents.
export function classifyOrder(_order) {
  throw new Error('TODO 6: classifyOrder')
}

// ---------------------------------------------------------------------------
// PRODUCTION
// ---------------------------------------------------------------------------

// 7. validateRegistration(input)
//    Return { ok: true, data } or { ok: false, errors: string[] }.
//    Rules:
//      - `email` must be a non-empty string with a valid shape (use exercise 1).
//      - `password` must be a string of length ≥ 12.
//      - `age` must coerce to a finite integer ≥ 13 (use exercise 2 with -1 fallback).
//      - `country` is optional; if provided, must be a 2-letter uppercase code.
//    On success, `data` is { email: normalizedLowercased, age, country? }.
//    Never throw on bad input — treat null/undefined/wrong-type as validation failures.
export function validateRegistration(_input) {
  throw new Error('TODO 7: validateRegistration')
}

// 8. aggregateRevenue(orders)
//    orders is an array of { status, total, currency, customerId }.
//    Consider only orders with status === 'paid' and currency === 'USD'.
//    Return { totalCents, byCustomer } where byCustomer is a plain object
//    mapping customerId → total cents for that customer.
//    `total` is in integer cents. Missing/non-numeric totals count as 0.
//    Empty input → { totalCents: 0, byCustomer: {} }.
export function aggregateRevenue(_orders) {
  throw new Error('TODO 8: aggregateRevenue')
}

// 9. loadConfig(env)
//    `env` is an object like process.env — every value is a string or undefined.
//    Return a config object with sensible defaults and typed values:
//      {
//        nodeEnv: 'development' | 'test' | 'production',
//        port: number in [1, 65535],
//        workers: number ≥ 1,
//        logLevel: 'debug' | 'info' | 'warn' | 'error',
//        features: { newCheckout: boolean, aiAssist: boolean },
//      }
//    Defaults: nodeEnv 'development', port 3000, workers 1, logLevel 'info',
//              features both false.
//    Reject invalid values by falling back to defaults, not by throwing.
export function loadConfig(_env = {}) {
  throw new Error('TODO 9: loadConfig')
}

// ---------------------------------------------------------------------------
// CHALLENGE
// ---------------------------------------------------------------------------

// 10. createQuotaTracker({ limit, windowMs })
//     Return an object with:
//       - `hit(userId)`: records a hit; returns { allowed: boolean, remaining: number, resetAt: number }.
//         When a user exceeds `limit` hits within the current window, `allowed` is false.
//       - `reset(userId)`: clears one user's counter.
//       - `snapshot()`: returns { users: number, totalHits: number }.
//     Requirements:
//       - Each user gets an independent rolling window; the window starts at their first hit
//         and resets automatically when it elapses.
//       - Use a Map to store per-user state. Never leak state between users.
//       - Handle invalid inputs (null userId, negative limit, etc.) by throwing a
//         TypeError with a clear message. This one boundary is allowed to throw —
//         it's programmer error, not user input.
//     Pass a `now` function in options for testability. Default to Date.now.
export function createQuotaTracker(_options = {}) {
  throw new Error('TODO 10: createQuotaTracker')
}

// ---------------------------------------------------------------------------
// SELF-CHECK — runs when you `node 01-fundamentals/exercises.js`.
// Each block is wrapped in try/catch so one failing tier doesn't hide the rest.
// ---------------------------------------------------------------------------

function section(name, fn) {
  try {
    fn()
    console.log(`  ok    ${name}`)
  } catch (err) {
    console.log(`  FAIL  ${name} — ${err.message}`)
  }
}

console.log('\n--- Beginner ---')
section('1. isValidEmailShape', () => {
  assert.equal(isValidEmailShape('ada@example.com'), true)
  assert.equal(isValidEmailShape(''), false)
  assert.equal(isValidEmailShape('nope'), false)
  assert.equal(isValidEmailShape('@nope'), false)
  assert.equal(isValidEmailShape('a@b@c'), false)
  assert.equal(isValidEmailShape(null), false)
})

section('2. safeParseInt', () => {
  assert.equal(safeParseInt('42'), 42)
  assert.equal(safeParseInt('12px'), 12)
  assert.equal(safeParseInt('abc', -1), -1)
  assert.equal(safeParseInt(null, 0), 0)
  assert.equal(safeParseInt(undefined, 99), 99)
  assert.equal(safeParseInt(NaN, 7), 7)
})

section('3. describeValue', () => {
  assert.equal(describeValue(null), 'null')
  assert.equal(describeValue(undefined), 'undefined')
  assert.equal(describeValue(NaN), 'nan')
  assert.equal(describeValue([]), 'array')
  assert.equal(describeValue({}), 'object')
  assert.equal(describeValue(1), 'number')
  assert.equal(describeValue('x'), 'string')
  assert.equal(describeValue(true), 'boolean')
})

console.log('\n--- Intermediate ---')
section('4. pickDefault', () => {
  assert.equal(pickDefault(0, 10), 0)
  assert.equal(pickDefault('', 'x'), '')
  assert.equal(pickDefault(false, true), false)
  assert.equal(pickDefault(null, 'fallback'), 'fallback')
  assert.equal(pickDefault(undefined, 'fallback'), 'fallback')
})

section('5. deepGet', () => {
  assert.equal(deepGet({ a: { b: { c: 1 } } }, 'a.b.c'), 1)
  assert.equal(deepGet({ a: null }, 'a.b.c'), undefined)
  assert.equal(deepGet(null, 'a'), undefined)
  assert.equal(deepGet({ a: 0 }, 'a'), 0) // 0 is a real value
})

section('6. classifyOrder', () => {
  assert.equal(classifyOrder(null), 'invalid')
  assert.equal(classifyOrder({ status: 'unknown', total: 100 }), 'invalid')
  assert.equal(classifyOrder({ status: 'cancelled', total: 100 }), 'cancelled')
  assert.equal(classifyOrder({ status: 'refunded', total: 100 }), 'refunded')
  assert.equal(classifyOrder({ status: 'paid', total: 15000 }), 'high-value')
  assert.equal(classifyOrder({ status: 'paid', total: 1000 }), 'standard')
  assert.equal(classifyOrder({ status: 'pending', total: 1000 }), 'pending')
})

console.log('\n--- Production ---')
section('7. validateRegistration', () => {
  const good = validateRegistration({
    email: ' Ada@Example.COM ',
    password: 'correct-horse-battery',
    age: '31',
    country: 'US',
  })
  assert.equal(good.ok, true)
  assert.equal(good.data.email, 'ada@example.com')
  assert.equal(good.data.age, 31)
  assert.equal(good.data.country, 'US')

  const bad = validateRegistration({ email: 'x', password: 'short', age: 8 })
  assert.equal(bad.ok, false)
  assert.ok(Array.isArray(bad.errors) && bad.errors.length >= 3)

  const missing = validateRegistration(null)
  assert.equal(missing.ok, false)
})

section('8. aggregateRevenue', () => {
  const result = aggregateRevenue([
    { status: 'paid', total: 4500, currency: 'USD', customerId: 'ada' },
    { status: 'paid', total: 8000, currency: 'USD', customerId: 'ada' },
    { status: 'paid', total: 5000, currency: 'EUR', customerId: 'linus' }, // wrong currency
    { status: 'refunded', total: 1000, currency: 'USD', customerId: 'grace' }, // wrong status
    { status: 'paid', total: null, currency: 'USD', customerId: 'grace' }, // missing total
  ])
  assert.equal(result.totalCents, 12500)
  assert.deepEqual(result.byCustomer, { ada: 12500, grace: 0 })

  assert.deepEqual(aggregateRevenue([]), { totalCents: 0, byCustomer: {} })
  assert.deepEqual(aggregateRevenue(null), { totalCents: 0, byCustomer: {} })
})

section('9. loadConfig', () => {
  const c = loadConfig({
    NODE_ENV: 'production',
    PORT: '8080',
    WORKERS: '4',
    LOG_LEVEL: 'warn',
    FEATURE_NEW_CHECKOUT: 'true',
  })
  assert.equal(c.nodeEnv, 'production')
  assert.equal(c.port, 8080)
  assert.equal(c.workers, 4)
  assert.equal(c.logLevel, 'warn')
  assert.equal(c.features.newCheckout, true)
  assert.equal(c.features.aiAssist, false)

  const defaults = loadConfig({})
  assert.equal(defaults.nodeEnv, 'development')
  assert.equal(defaults.port, 3000)
  assert.equal(defaults.workers, 1)
  assert.equal(defaults.logLevel, 'info')

  const bad = loadConfig({ PORT: 'not-a-port', WORKERS: '-2', LOG_LEVEL: 'sudo' })
  assert.equal(bad.port, 3000)
  assert.equal(bad.workers, 1)
  assert.equal(bad.logLevel, 'info')
})

console.log('\n--- Challenge ---')
section('10. createQuotaTracker', () => {
  let clock = 1_000_000
  const tick = (ms) => { clock += ms }
  const tracker = createQuotaTracker({ limit: 3, windowMs: 1000, now: () => clock })

  const a1 = tracker.hit('ada')
  assert.equal(a1.allowed, true)
  assert.equal(a1.remaining, 2)

  tracker.hit('ada')
  const a3 = tracker.hit('ada')
  assert.equal(a3.remaining, 0)

  const a4 = tracker.hit('ada')
  assert.equal(a4.allowed, false)

  // Different user — independent window.
  const l1 = tracker.hit('linus')
  assert.equal(l1.allowed, true)
  assert.equal(l1.remaining, 2)

  // Advance past the window — ada resets.
  tick(1500)
  const a5 = tracker.hit('ada')
  assert.equal(a5.allowed, true)
  assert.equal(a5.remaining, 2)

  // Snapshot.
  const snap = tracker.snapshot()
  assert.equal(typeof snap.users, 'number')
  assert.ok(snap.totalHits >= 5)

  // Invalid input throws.
  assert.throws(() => tracker.hit(null), TypeError)
  assert.throws(() => createQuotaTracker({ limit: -1, windowMs: 1000 }), TypeError)
})

console.log('\ndone — implement each TODO until all sections say "ok".\n')
