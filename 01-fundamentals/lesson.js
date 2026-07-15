// Module 01 — fundamentals — lesson
// Run: node 01-fundamentals/lesson.js
//
// Read the code, then read the output, then change something and re-run.
// Every section prints a labeled banner so you can find output in the terminal.

// ---------------------------------------------------------------------------
// 1. Variables — const, let, and why var is gone.
// Hint: Default to `const`; use `let` only when you must reassign. Both are
//       block-scoped, so a name declared inside `{ }` cannot leak out.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 1. Variables ===')

  const MAX_RETRIES = 3
  let attempt = 0

  while (attempt < MAX_RETRIES) attempt++
  console.log('attempts:', attempt) // 3

  // Block scope: `attempt` above doesn't exist outside this block.
  // Try uncommenting the next line — Node will throw a ReferenceError.
  // console.log(attempt)
}

// ---------------------------------------------------------------------------
// 2. Primitives vs objects.
// Hint: Primitives compare by value; objects compare by reference (identity).
//       Copy with `{ ...obj }` before mutating to avoid surprising a shared alias.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 2. Primitives vs objects ===')

  // Primitives — compared by value.
  console.log('primitive equality:', 'ada' === 'ada') // true

  // Objects — compared by reference.
  console.log('object equality:', { a: 1 } === { a: 1 }) // false

  // Same reference — same identity.
  const user = { name: 'Ada' }
  const alias = user
  alias.name = 'Grace'
  console.log('mutation via alias:', user.name) // 'Grace'

  // Snapshot to avoid mutation surprises.
  const snapshot = { ...user }
  snapshot.name = 'Linus'
  console.log('user after snapshot mutation:', user.name) // 'Grace' — safe
}

// ---------------------------------------------------------------------------
// 3. Type conversion — coerce at the boundary.
// Hint: External input (query strings, env vars, JSON) arrives as text. Convert
//       once at the edge with `Number.parseInt(x, 10)` and validate immediately.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 3. Type conversion ===')

  // Realistic scenario: reading a query string.
  const rawLimit = '20'
  const limit = Number.parseInt(rawLimit, 10)
  console.log('limit:', limit, 'isFinite:', Number.isFinite(limit))

  // The surprising ones.
  console.log("Number(''):", Number('')) // 0
  console.log('Number(null):', Number(null)) // 0
  console.log('Number(undefined):', Number(undefined)) // NaN
  console.log("Number('12px'):", Number('12px')) // NaN
  console.log("parseInt('12px'):", Number.parseInt('12px', 10)) // 12
}

// ---------------------------------------------------------------------------
// 4. Equality — always strict.
// Hint: Use `===` / `!==` to skip coercion pitfalls. Test NaN with
//       `Number.isNaN`. The only blessed `==` is `x == null` (null OR undefined).
// ---------------------------------------------------------------------------
{
  console.log('\n=== 4. Equality ===')

  const role = 'admin'
  console.log('strict role check:', role === 'admin') // true

  // NaN never equals itself.
  console.log('NaN === NaN:', NaN === NaN) // false
  console.log('Number.isNaN(NaN):', Number.isNaN(NaN)) // true

  // The one accepted use of ==: shorthand for "null or undefined".
  const value = undefined
  console.log('value == null:', value == null) // true — covers both cases
}

// ---------------------------------------------------------------------------
// 5. Operators — ??, ?., and short-circuit patterns.
// Hint: `??` only fills in null/undefined (keeps 0 and ''), while `||` also
//       replaces those falsy-but-valid values. `?.` stops a traversal at the
//       first missing link instead of throwing.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 5. Modern operators ===')

  // Nullish coalescing — respects 0 and ''.
  const volume = 0
  console.log('|| default (wrong):', volume || 50) // 50 — bug
  console.log('?? default (right):', volume ?? 50) // 0

  // Optional chaining — traverse a possibly-missing shape.
  const order = { shipping: { address: null } }
  console.log('deep optional read:', order.shipping?.address?.city ?? 'N/A')

  // Optional call — invoke a callback only if provided.
  const onDone = undefined
  onDone?.('finished') // no error, no output
  console.log('optional call: ok')
}

// ---------------------------------------------------------------------------
// 6. Control flow — guard clauses.
// Hint: Return early on each failure ("guard clause") instead of nesting `if`s.
//       The happy path stays flat and last, and each rejection is easy to read.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 6. Control flow ===')

  /**
   * Decide whether an order can be refunded, using guard clauses.
   *
   * Rejects on the first failing precondition (permission, order state, prior
   * refund) so the success case is reached only when every check passes.
   *
   * @param {{status?: string, refundedAt?: string}} order The order to refund.
   * @param {{can?: (perm: string) => boolean}|null|undefined} user The requesting user.
   * @returns {{ok: true, refundedAt: string} | {ok: false, reason: 'forbidden'|'not-paid'|'already-refunded'}}
   *   `ok: true` with a timestamp on success; otherwise `ok: false` with a reason code.
   */
  function refund(order, user) {
    if (!user?.can?.('refund')) return { ok: false, reason: 'forbidden' }
    if (order.status !== 'paid') return { ok: false, reason: 'not-paid' }
    if (order.refundedAt) return { ok: false, reason: 'already-refunded' }
    return { ok: true, refundedAt: '2026-07-13T12:00:00Z' }
  }

  const admin = { can: (perm) => perm === 'refund' }
  console.log(refund({ status: 'paid' }, admin))
  console.log(refund({ status: 'pending' }, admin))
  console.log(refund({ status: 'paid' }, { can: () => false }))
}

// ---------------------------------------------------------------------------
// 7. Loops — pick by intent.
// Hint: Reach for `map`/`filter`/`reduce` for pure transforms; use `for...of`
//       (with `.entries()` when you need the index) for side effects.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 7. Loops ===')

  const cart = [
    { name: 'Coffee', price: 4.5, qty: 2 },
    { name: 'Bagel', price: 3.0, qty: 1 },
    { name: 'Tea', price: 3.5, qty: 3 },
  ]

  // Pure transforms — array methods.
  const lines = cart.map((item) => ({ ...item, total: item.price * item.qty }))
  const revenue = lines.reduce((sum, l) => sum + l.total, 0)
  console.log('lines:', lines)
  console.log('revenue:', revenue.toFixed(2))

  // Need both value and index — for...of with entries().
  for (const [i, item] of cart.entries()) {
    console.log(`row ${i + 1}: ${item.name}`)
  }
}

// ---------------------------------------------------------------------------
// 8. Scope — closure over let bindings.
// Hint: A closure captures the variable, not its value — so private state
//       survives between calls. `let` gives each loop iteration a fresh binding.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 8. Scope ===')

  /**
   * Create an isolated counter whose state is private via closure.
   *
   * The returned methods close over the `count` binding; there is no way to read
   * or mutate it except through them.
   *
   * @returns {{increment: () => number, read: () => number}}
   *   `increment` bumps the count and returns the new value; `read` returns the current value.
   */
  function makeCounter() {
    let count = 0
    return {
      increment: () => ++count,
      read: () => count,
    }
  }

  const c = makeCounter()
  c.increment()
  c.increment()
  console.log('counter:', c.read()) // 2

  // Loop-scope trap: with `let`, each iteration has a fresh binding.
  const delayed = []
  for (let i = 0; i < 3; i++) delayed.push(() => i)
  console.log(
    'let bindings:',
    delayed.map((fn) => fn()),
  ) // [0, 1, 2]
}

// ---------------------------------------------------------------------------
// 9. Floating-point money bug — the classic.
// Hint: Binary floats can't represent every decimal, so never store money as a
//       float. Work in integer cents and format back to dollars only for display.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 9. Floating point ===')

  console.log('0.1 + 0.2 =', 0.1 + 0.2) // 0.30000000000000004
  console.log('=== 0.3?', 0.1 + 0.2 === 0.3) // false

  // Fix: work in integer cents.

  /**
   * Convert dollars to an integer number of cents.
   * @param {number} usd Amount in dollars.
   * @returns {number} Amount in whole cents.
   */
  const cents = (usd) => Math.round(usd * 100)

  /**
   * Format integer cents as a 2-decimal dollar string.
   * @param {number} c Amount in whole cents.
   * @returns {string} Dollar amount with two decimals (e.g. `"0.30"`).
   */
  const dollars = (c) => (c / 100).toFixed(2)
  const total = cents(0.1) + cents(0.2)
  console.log('safe total:', dollars(total)) // '0.30'
}

// ---------------------------------------------------------------------------
// 10. Defensive input validation — a taste of what the mini-project does.
// Hint: Treat all input as hostile: parse, bound (clamp to a max), and fall back
//       to a safe default. Never trust a client-supplied number as-is.
// ---------------------------------------------------------------------------
{
  console.log('\n=== 10. Input validation ===')

  /**
   * Normalize untrusted pagination query parameters into safe values.
   *
   * Parses `page`/`limit` as base-10 integers, rejects non-positive or
   * non-numeric values, and caps `limit` at 100 to protect the backend.
   *
   * @param {{page?: string|number, limit?: string|number}} [query={}] Raw query parameters.
   * @returns {{page: number, limit: number}}
   *   `page` defaults to 1; `limit` defaults to 20 and is clamped to a maximum of 100.
   */
  function parsePagination(query = {}) {
    const page = Number.parseInt(query.page, 10)
    const limit = Number.parseInt(query.limit, 10)
    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit:
        Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20,
    }
  }

  console.log(parsePagination({})) // { page: 1, limit: 20 }
  console.log(parsePagination({ page: '3', limit: '500' })) // { page: 3, limit: 100 }
  console.log(parsePagination({ page: 'abc' })) // { page: 1, limit: 20 }
}

console.log('\nlesson complete — now open exercises.js')
