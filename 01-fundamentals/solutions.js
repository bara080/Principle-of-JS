// Module 01 — fundamentals — solutions
// Run: node 01-fundamentals/solutions.js
//
// Reference solutions with production-quality style. Open only after you've
// attempted `exercises.js`. Read the comments — they explain the "why."

import assert from 'node:assert/strict'

// ---------------------------------------------------------------------------
// BEGINNER
// ---------------------------------------------------------------------------

// 1. Non-empty string, exactly one "@", non-empty local and domain parts.
export function isValidEmailShape(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  const parts = trimmed.split('@')
  if (parts.length !== 2) return false
  return parts[0].length > 0 && parts[1].length > 0
}

// 2. Try parseInt; if the result isn't finite, use the fallback.
export function safeParseInt(value, fallback = 0) {
  if (value === null || value === undefined) return fallback
  const n = Number.parseInt(String(value).trim(), 10)
  return Number.isFinite(n) ? n : fallback
}

// 3. Explicit narrowing — check null/NaN/array before falling through to typeof.
export function describeValue(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'number' && Number.isNaN(value)) return 'nan'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

// ---------------------------------------------------------------------------
// INTERMEDIATE
// ---------------------------------------------------------------------------

// 4. `??` implemented by hand — return `fallback` only for null/undefined.
export function pickDefault(value, fallback) {
  return value === null || value === undefined ? fallback : value
}

// 5. Walk the segments, bailing out the moment we hit null/undefined.
export function deepGet(object, path) {
  if (object === null || object === undefined) return undefined
  const segments = String(path).split('.')
  let current = object
  for (const segment of segments) {
    if (current === null || current === undefined) return undefined
    current = current[segment]
  }
  return current
}

// 6. Guard clauses, exit early. No nested `if`.
export function classifyOrder(order) {
  if (order === null || order === undefined) return 'invalid'
  const allowed = new Set(['pending', 'paid', 'refunded', 'cancelled'])
  if (!allowed.has(order.status)) return 'invalid'
  if (order.status === 'cancelled') return 'cancelled'
  if (order.status === 'refunded') return 'refunded'
  if (order.status === 'paid' && Number(order.total) >= 10_000) return 'high-value'
  if (order.status === 'paid') return 'standard'
  return 'pending'
}

// ---------------------------------------------------------------------------
// PRODUCTION
// ---------------------------------------------------------------------------

// 7. Return errors as data; never throw on user input.
export function validateRegistration(input) {
  const errors = []

  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
  if (!isValidEmailShape(email)) errors.push('email must be a valid address')

  const password = typeof input?.password === 'string' ? input.password : ''
  if (password.length < 12) errors.push('password must be at least 12 characters')

  const age = safeParseInt(input?.age, -1)
  if (age < 13) errors.push('age must be a number ≥ 13')

  const country = input?.country
  const hasCountry = country !== undefined && country !== null
  const validCountry = typeof country === 'string' && /^[A-Z]{2}$/.test(country)
  if (hasCountry && !validCountry) errors.push('country must be a 2-letter uppercase code')

  if (errors.length) return { ok: false, errors }

  const data = { email, age }
  if (hasCountry) data.country = country
  return { ok: true, data }
}

// 8. Filter, then reduce — no mutation of the input array.
export function aggregateRevenue(orders) {
  if (!Array.isArray(orders)) return { totalCents: 0, byCustomer: {} }

  const eligible = orders.filter(
    (o) => o?.status === 'paid' && o?.currency === 'USD',
  )

  const byCustomer = {}
  let totalCents = 0
  for (const order of eligible) {
    const amount = Number.isFinite(order.total) ? order.total : 0
    byCustomer[order.customerId] = (byCustomer[order.customerId] ?? 0) + amount
    totalCents += amount
  }
  return { totalCents, byCustomer }
}

// 9. Parse each field independently with its own validator.
const LOG_LEVELS = new Set(['debug', 'info', 'warn', 'error'])
const NODE_ENVS = new Set(['development', 'test', 'production'])

export function loadConfig(env = {}) {
  const nodeEnv = NODE_ENVS.has(env.NODE_ENV) ? env.NODE_ENV : 'development'

  const rawPort = safeParseInt(env.PORT, NaN)
  const port =
    Number.isFinite(rawPort) && rawPort >= 1 && rawPort <= 65_535 ? rawPort : 3000

  const rawWorkers = safeParseInt(env.WORKERS, NaN)
  const workers = Number.isFinite(rawWorkers) && rawWorkers >= 1 ? rawWorkers : 1

  const logLevel = LOG_LEVELS.has(env.LOG_LEVEL) ? env.LOG_LEVEL : 'info'

  return {
    nodeEnv,
    port,
    workers,
    logLevel,
    features: {
      newCheckout: env.FEATURE_NEW_CHECKOUT === 'true',
      aiAssist: env.FEATURE_AI_ASSIST === 'true',
    },
  }
}

// ---------------------------------------------------------------------------
// CHALLENGE
// ---------------------------------------------------------------------------

// 10. Closure-based state, Map for per-user isolation.
export function createQuotaTracker({ limit, windowMs, now = Date.now } = {}) {
  if (!Number.isFinite(limit) || limit < 1) {
    throw new TypeError('limit must be a positive number')
  }
  if (!Number.isFinite(windowMs) || windowMs < 1) {
    throw new TypeError('windowMs must be a positive number')
  }

  const state = new Map()
  let totalHits = 0

  function ensureUserId(userId) {
    if (userId === null || userId === undefined || userId === '') {
      throw new TypeError('userId is required')
    }
  }

  function hit(userId) {
    ensureUserId(userId)
    const current = now()
    const entry = state.get(userId)

    // Fresh window if none exists or the previous one elapsed.
    if (!entry || current >= entry.resetAt) {
      const fresh = { count: 1, resetAt: current + windowMs }
      state.set(userId, fresh)
      totalHits++
      return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt }
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    totalHits++
    return {
      allowed: true,
      remaining: limit - entry.count,
      resetAt: entry.resetAt,
    }
  }

  function reset(userId) {
    ensureUserId(userId)
    state.delete(userId)
  }

  function snapshot() {
    return { users: state.size, totalHits }
  }

  return { hit, reset, snapshot }
}

// ---------------------------------------------------------------------------
// SELF-CHECK — same suite as exercises.js, but hitting the reference impls.
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running solutions self-check...')

  assert.equal(isValidEmailShape('ada@example.com'), true)
  assert.equal(safeParseInt('12px', -1), 12)
  assert.equal(describeValue(NaN), 'nan')
  assert.equal(pickDefault(0, 10), 0)
  assert.equal(deepGet({ a: 0 }, 'a'), 0)
  assert.equal(classifyOrder({ status: 'paid', total: 15000 }), 'high-value')

  const reg = validateRegistration({ email: 'Ada@Example.com', password: 'x'.repeat(12), age: 30 })
  assert.equal(reg.ok, true)
  assert.equal(reg.data.email, 'ada@example.com')

  const agg = aggregateRevenue([
    { status: 'paid', total: 1000, currency: 'USD', customerId: 'a' },
    { status: 'paid', total: 2000, currency: 'USD', customerId: 'a' },
  ])
  assert.equal(agg.totalCents, 3000)

  const cfg = loadConfig({ NODE_ENV: 'production', PORT: '9000' })
  assert.equal(cfg.port, 9000)

  let clock = 0
  const tr = createQuotaTracker({ limit: 2, windowMs: 100, now: () => clock })
  assert.equal(tr.hit('u').allowed, true)
  assert.equal(tr.hit('u').allowed, true)
  assert.equal(tr.hit('u').allowed, false)
  clock = 200
  assert.equal(tr.hit('u').allowed, true)

  console.log('all solutions verified ✓')
}
