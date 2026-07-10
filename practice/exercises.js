/**
 * Practice exercises — fill these in, then run `npm test`.
 *
 * Every function throws until you implement it. The tests describe exactly
 * what "correct" means, including the edge cases that are easy to miss.
 * Read practice/exercises.test.js if you want to know what's being checked.
 *
 * Answer key: task.md → Part 3.
 * Don't open it until you've watched a test fail and tried to fix it.
 */

const TODO = name => {
  throw new Error(`${name}() is not implemented yet — see practice/exercises.js`)
}

/**
 * 1. Return a promise that resolves after `ms` milliseconds.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  TODO('delay')
}

/**
 * 2. Reimplement Promise.all using only `new Promise`.
 *
 * - Resolve with results in INPUT order, not settle order.
 * - Reject as soon as any input rejects.
 * - Resolve with [] for an empty array (don't hang forever).
 * - Accept non-promise values mixed in, like the real one does.
 *
 * @param {Array<Promise<any>|any>} promises
 * @returns {Promise<any[]>}
 */
export function promiseAll(promises) {
  TODO('promiseAll')
}

/**
 * 3. Call `fn`. If it rejects, retry up to `retries` total attempts.
 *    Wait `backoff` ms before the 2nd attempt, doubling each time
 *    (backoff, backoff*2, backoff*4, ...). If every attempt fails,
 *    reject with the LAST error.
 *
 * `fn` is called with the attempt number, starting at 1.
 *
 * @param {(attempt: number) => Promise<any>} fn
 * @param {number} retries
 * @param {number} backoff
 * @returns {Promise<any>}
 */
export function retry(fn, retries = 3, backoff = 50) {
  TODO('retry')
}

/**
 * 4. Return a memoized version of `fn` — same arguments, cached result.
 *    `fn` should run only once per distinct argument list.
 *
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  TODO('memoize')
}

/**
 * 5. Run every function in `fns` CONCURRENTLY and return their results
 *    in order. Each is an async function taking no arguments.
 *
 *    If they each take 100ms, all of them together must take ~100ms,
 *    not 100ms × fns.length. The test times you.
 *
 * @param {Array<() => Promise<any>>} fns
 * @returns {Promise<any[]>}
 */
export function loadAll(fns) {
  TODO('loadAll')
}

/**
 * 6. Fetch JSON, classifying failure into three kinds.
 *
 *    - network failure  → ApiError with kind 'network'
 *    - non-2xx response → ApiError with kind 'http', and `status` set
 *    - bad JSON body    → ApiError with kind 'parse'
 *
 *    Always attach the original error as `cause` where there is one.
 *
 *    `fetchImpl` is injected so the tests can fake it. Default it to the
 *    global `fetch` so real calls work too.
 *
 * @param {string} url
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<any>}
 */
export async function getJSON(url, fetchImpl = fetch) {
  TODO('getJSON')
}

/**
 * Throw this from getJSON. Already written for you — study it.
 * `super(message, { cause })` preserves the original error's stack.
 */
export class ApiError extends Error {
  constructor(message, { kind, status, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}
