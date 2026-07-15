// Module 01 — fundamentals — examples
// Run: node 01-fundamentals/examples.js
//
// Realistic scenarios where fundamentals show up in production code.
// These are meant to be read, not just executed — read each block, run the
// file, then edit values to see how the outputs change.

// ---------------------------------------------------------------------------
// A. User registration validation.
// ---------------------------------------------------------------------------

/**
 * Validate and normalize a user registration payload.
 *
 * Coerces untrusted input at the boundary (email lower-cased and trimmed, age
 * parsed to an integer) and collects every failure instead of rejecting on the
 * first one, so the caller can surface all problems at once.
 *
 * @param {object|null|undefined} input                  Raw registration payload.
 * @param {string} [input.email]                         User email; must be non-empty and contain "@".
 * @param {string} [input.password]                      Plain-text password; must be at least 12 characters.
 * @param {string|number} [input.age]                    Age; parsed with base-10 and must be a finite number ≥ 13.
 * @returns {{ok: true, data: {email: string, age: number}} | {ok: false, errors: string[]}}
 *   On success, `ok: true` with the normalized `data`. On failure, `ok: false`
 *   with a list of human-readable `errors`.
 *
 * @example
 * validateRegistration({ email: 'ada@example.com', password: 'correct-horse-battery', age: '31' })
 * // => { ok: true, data: { email: 'ada@example.com', age: 31 } }
 */
function validateRegistration(input) {
  const errors = []
  const email = String(input?.email ?? '').trim().toLowerCase()
  const password = String(input?.password ?? '')
  const age = Number.parseInt(input?.age, 10)

  if (!email) errors.push('email is required')
  else if (!email.includes('@')) errors.push('email must contain @')

  if (password.length < 12) errors.push('password must be at least 12 chars')

  if (!Number.isFinite(age) || age < 13) {
    errors.push('age must be a number ≥ 13')
  }

  if (errors.length) return { ok: false, errors }
  return { ok: true, data: { email, age } }
}

console.log('\n=== A. Registration ===')
console.log(validateRegistration({ email: 'ada@example.com', password: 'correct-horse-battery', age: '31' }))
console.log(validateRegistration({ email: '', password: 'short', age: 8 }))
console.log(validateRegistration(null))

// ---------------------------------------------------------------------------
// B. Shopping-cart totals — floating-point-safe.
// ---------------------------------------------------------------------------

/**
 * Convert a US-dollar amount to an integer number of cents.
 *
 * Working in integer cents avoids binary floating-point rounding errors when
 * summing monetary values.
 *
 * @param {number} usd Amount in dollars (e.g. `4.5`).
 * @returns {number} Amount in whole cents (e.g. `450`).
 */
const toCents = (usd) => Math.round(usd * 100)

/**
 * Format an integer number of cents as a fixed 2-decimal dollar string.
 *
 * @param {number} cents Amount in whole cents (e.g. `450`).
 * @returns {string} Dollar amount with two decimals (e.g. `"4.50"`).
 */
const toDollars = (cents) => (cents / 100).toFixed(2)

/**
 * Compute the subtotal, tax, discount, and total for a shopping cart.
 *
 * All arithmetic is performed in integer cents to stay floating-point-safe;
 * the total is clamped at zero so an oversized discount never yields a negative
 * amount. Missing fields default to sensible zero-values.
 *
 * @param {object|null|undefined} cart              The cart.
 * @param {Array<{name?: string, price?: number, qty?: number}>} [cart.items] Line items; `price` in dollars, `qty` as a count.
 * @param {number} [cart.taxRate=0]                 Tax rate as a fraction (e.g. `0.0875` for 8.75%).
 * @param {number} [cart.discountCents=0]           Flat discount in cents.
 * @returns {{subtotal: string, tax: string, discount: string, total: string}}
 *   Each field is a formatted dollar string (see {@link toDollars}).
 */
function computeCart(cart) {
  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => {
    const price = toCents(item.price ?? 0)
    const qty = Number.isFinite(item.qty) ? item.qty : 0
    return sum + price * qty
  }, 0)

  const taxRate = cart?.taxRate ?? 0
  const tax = Math.round(subtotal * taxRate)
  const discount = cart?.discountCents ?? 0
  const total = Math.max(subtotal + tax - discount, 0)

  return {
    subtotal: toDollars(subtotal),
    tax: toDollars(tax),
    discount: toDollars(discount),
    total: toDollars(total),
  }
}

console.log('\n=== B. Cart totals ===')
console.log(
  computeCart({
    items: [
      { name: 'Coffee', price: 4.5, qty: 2 },
      { name: 'Bagel', price: 3.0, qty: 1 },
    ],
    taxRate: 0.0875,
    discountCents: 100,
  }),
)

// ---------------------------------------------------------------------------
// C. API response handling — defensive traversal.
// ---------------------------------------------------------------------------

/**
 * Derive a human-readable display name from a possibly-partial user object.
 *
 * Walks a preference chain with optional chaining and nullish coalescing so a
 * missing intermediate property never throws. Falls back to the email local
 * part, then to `"Anonymous"`.
 *
 * @param {object|null|undefined} user            The user (full, minimal, or absent).
 * @param {{displayName?: string}} [user.profile]  Nested profile object.
 * @param {string} [user.name]                     Top-level name.
 * @param {string} [user.email]                    Email; its local part is used as a last resort.
 * @returns {string} The best available display name, or `"Anonymous"`.
 */
function displayName(user) {
  // API might return: full user, minimal user, or an error envelope.
  return (
    user?.profile?.displayName
    ?? user?.name
    ?? user?.email?.split('@')[0]
    ?? 'Anonymous'
  )
}

console.log('\n=== C. API response ===')
console.log(displayName({ profile: { displayName: 'Ada L.' } })) // 'Ada L.'
console.log(displayName({ name: 'Ada' }))                        // 'Ada'
console.log(displayName({ email: 'ada@example.com' }))           // 'ada'
console.log(displayName({}))                                     // 'Anonymous'
console.log(displayName(null))                                   // 'Anonymous'

// ---------------------------------------------------------------------------
// D. Environment configuration — coerce and default at the boundary.
// ---------------------------------------------------------------------------

/**
 * Parse environment variables into a typed, defaulted configuration object.
 *
 * Environment variables are always strings, so numbers are parsed and validated
 * and booleans are compared explicitly against `"true"`. Invalid or missing
 * values fall back to safe defaults.
 *
 * @param {Record<string, string|undefined>} [env=process.env] Source environment map.
 * @returns {{
 *   nodeEnv: string,
 *   port: number,
 *   workers: number,
 *   debug: boolean,
 *   features: {newCheckout: boolean}
 * }} Normalized configuration. Defaults: `nodeEnv="development"`, `port=3000`,
 *   `workers=1`, `debug=false`, `features.newCheckout=false`.
 */
function loadConfig(env = process.env) {
  const port = Number.parseInt(env.PORT, 10)
  const workers = Number.parseInt(env.WORKERS, 10)

  return {
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number.isFinite(port) && port > 0 ? port : 3000,
    workers: Number.isFinite(workers) && workers > 0 ? workers : 1,
    debug: env.DEBUG === 'true',
    features: {
      newCheckout: env.FEATURE_NEW_CHECKOUT === 'true',
    },
  }
}

console.log('\n=== D. Config ===')
console.log(loadConfig({ NODE_ENV: 'production', PORT: '8080', DEBUG: 'true' }))
console.log(loadConfig({})) // defaults

// ---------------------------------------------------------------------------
// E. Permissions and roles — never mix string equality with coercion.
// ---------------------------------------------------------------------------
/** Known user roles, ordered from least to most privileged. @type {readonly string[]} */
const ROLES = /** @type {const} */ (['guest', 'customer', 'staff', 'admin'])

/**
 * Determine whether a user is authorized to perform an action.
 *
 * Uses a static role-based access-control table. Fails closed: an unknown role,
 * an unknown action, or a missing user all return `false` without throwing.
 *
 * @param {{role?: string}|null|undefined} user The acting user; `role` must be one of {@link ROLES}.
 * @param {'orders:read'|'orders:refund'|'users:delete'} action The permission being checked.
 * @returns {boolean} `true` only if the user's role grants the action.
 */
function can(user, action) {
  const role = user?.role
  if (!ROLES.includes(role)) return false

  const rules = {
    'orders:read':   ['customer', 'staff', 'admin'],
    'orders:refund': ['staff', 'admin'],
    'users:delete':  ['admin'],
  }

  return rules[action]?.includes(role) ?? false
}

console.log('\n=== E. Permissions ===')
console.log(can({ role: 'customer' }, 'orders:read'))   // true
console.log(can({ role: 'customer' }, 'orders:refund')) // false
console.log(can({ role: 'admin' }, 'users:delete'))     // true
console.log(can(null, 'orders:read'))                   // false — no throw

// ---------------------------------------------------------------------------
// F. Filtering and processing "database" records.
// ---------------------------------------------------------------------------
const orders = [
  { id: 1, status: 'paid',    total: 4500, customer: 'ada'   },
  { id: 2, status: 'refunded',total: 1200, customer: 'grace' },
  { id: 3, status: 'paid',    total: 8000, customer: 'ada'   },
  { id: 4, status: 'pending', total: 3000, customer: 'linus' },
]

const totalsByCustomer = orders
  .filter((o) => o.status === 'paid')
  .reduce((acc, o) => {
    acc[o.customer] = (acc[o.customer] ?? 0) + o.total
    return acc
  }, /** @type {Record<string, number>} */ ({}))

console.log('\n=== F. Aggregation ===')
console.log(totalsByCustomer) // { ada: 12500, linus and grace excluded }

// ---------------------------------------------------------------------------
// G. Handling optional or missing values.
// ---------------------------------------------------------------------------

/**
 * Build a display-ready summary of a shipment, tolerating missing fields.
 *
 * Substitutes placeholders for absent carrier/ETA and only constructs a
 * tracking URL when a tracking id is present.
 *
 * @param {object|null|undefined} shipment      The shipment.
 * @param {string} [shipment.carrier]           Carrier name; defaults to `"unknown"`.
 * @param {string} [shipment.eta]               Estimated arrival; defaults to `"TBD"`.
 * @param {string} [shipment.trackingId]        Tracking id used to build the tracking URL.
 * @returns {{carrier: string, eta: string, trackingUrl: string|null}}
 *   `trackingUrl` is `null` when no tracking id is available.
 */
function summarizeShipment(shipment) {
  const carrier = shipment?.carrier ?? 'unknown'
  const eta = shipment?.eta ?? 'TBD'
  const trackingUrl = shipment?.trackingId
    ? `https://track.example.com/${shipment.trackingId}`
    : null

  return { carrier, eta, trackingUrl }
}

console.log('\n=== G. Optional values ===')
console.log(summarizeShipment({ carrier: 'UPS', trackingId: '1Z999' }))
console.log(summarizeShipment(null))
console.log(summarizeShipment({}))
