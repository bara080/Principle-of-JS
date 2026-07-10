import test, { describe } from 'node:test'
import assert from 'node:assert/strict'

import {
  delay,
  promiseAll,
  retry,
  memoize,
  loadAll,
  getJSON,
  ApiError,
} from './exercises.js'

// --- helpers -----------------------------------------------------------

const sleep = ms => new Promise(r => setTimeout(r, ms))
const after = (ms, value) => sleep(ms).then(() => value)
const rejectAfter = (ms, err) => sleep(ms).then(() => Promise.reject(err))

/** setTimeout can fire a hair early; allow a small negative margin. */
const atLeast = (actual, expected, label) =>
  assert.ok(
    actual >= expected - 15,
    `${label}: expected at least ${expected}ms, got ${Math.round(actual)}ms`,
  )

const under = (actual, limit, label) =>
  assert.ok(
    actual < limit,
    `${label}: expected under ${limit}ms, got ${Math.round(actual)}ms`,
  )

// --- 1. delay ----------------------------------------------------------

describe('delay', () => {
  test('resolves after roughly the given time', async () => {
    const start = performance.now()
    await delay(100)
    atLeast(performance.now() - start, 100, 'delay(100)')
  })

  test('returns a promise', () => {
    assert.ok(delay(0) instanceof Promise)
  })
})

// --- 2. promiseAll -----------------------------------------------------

describe('promiseAll', () => {
  test('resolves with values in INPUT order, not settle order', async () => {
    // 'a' settles last but must come first.
    const result = await promiseAll([after(60, 'a'), after(30, 'b'), after(1, 'c')])
    assert.deepEqual(result, ['a', 'b', 'c'])
  })

  test('resolves with [] on an empty array (does not hang)', async () => {
    assert.deepEqual(await promiseAll([]), [])
  })

  test('accepts non-promise values mixed in', async () => {
    assert.deepEqual(await promiseAll([1, after(10, 2), 3]), [1, 2, 3])
  })

  test('rejects with the first rejection', async () => {
    const boom = new Error('boom')
    await assert.rejects(
      () => promiseAll([after(50, 'slow'), rejectAfter(5, boom)]),
      /boom/,
    )
  })

  test('rejects fast — does not wait for the slow ones', async () => {
    const start = performance.now()
    await assert.rejects(() =>
      promiseAll([after(300, 'slow'), rejectAfter(10, new Error('boom'))]),
    )
    under(performance.now() - start, 200, 'fail-fast')
  })

  test('runs its promises concurrently', async () => {
    const start = performance.now()
    await promiseAll([after(80, 1), after(80, 2), after(80, 3)])
    under(performance.now() - start, 200, 'concurrency')
  })
})

// --- 3. retry ----------------------------------------------------------

describe('retry', () => {
  test('returns immediately when fn succeeds first try', async () => {
    let calls = 0
    const result = await retry(async () => {
      calls++
      return 'ok'
    })
    assert.equal(result, 'ok')
    assert.equal(calls, 1, 'should not retry a success')
  })

  test('retries until it succeeds', async () => {
    let calls = 0
    const result = await retry(async attempt => {
      calls++
      if (attempt < 3) throw new Error('flaky')
      return 'recovered'
    }, 3, 10)
    assert.equal(result, 'recovered')
    assert.equal(calls, 3)
  })

  test('passes the attempt number, starting at 1', async () => {
    const seen = []
    await retry(async attempt => {
      seen.push(attempt)
      if (attempt < 3) throw new Error('again')
      return 'done'
    }, 3, 5)
    assert.deepEqual(seen, [1, 2, 3])
  })

  test('gives up after `retries` attempts and throws the LAST error', async () => {
    let calls = 0
    await assert.rejects(
      () =>
        retry(async attempt => {
          calls++
          throw new Error(`failure ${attempt}`)
        }, 3, 5),
      /failure 3/,
    )
    assert.equal(calls, 3, 'should attempt exactly `retries` times')
  })

  test('backs off exponentially between attempts', async () => {
    const start = performance.now()
    await assert.rejects(() =>
      retry(async () => { throw new Error('nope') }, 3, 50),
    )
    // waits of 50ms then 100ms = 150ms total; no wait after the last failure
    atLeast(performance.now() - start, 150, 'exponential backoff')
  })
})

// --- 4. memoize --------------------------------------------------------

describe('memoize', () => {
  test('returns the same result as the original', () => {
    const double = memoize(n => n * 2)
    assert.equal(double(21), 42)
  })

  test('calls the underlying fn only once per distinct argument', () => {
    let calls = 0
    const fn = memoize(n => { calls++; return n * 2 })

    fn(2); fn(2); fn(2)
    assert.equal(calls, 1, 'repeat call should hit the cache')

    fn(3)
    assert.equal(calls, 2, 'new argument should miss the cache')
  })

  test('distinguishes different argument lists', () => {
    const add = memoize((a, b) => a + b)
    assert.equal(add(1, 2), 3)
    assert.equal(add(2, 1), 3)
    assert.equal(add(10, 20), 30)
  })

  test('caches falsy results too', () => {
    let calls = 0
    const fn = memoize(() => { calls++; return 0 })
    assert.equal(fn(), 0)
    assert.equal(fn(), 0)
    assert.equal(calls, 1, 'a cached 0 must not be treated as a cache miss')
  })
})

// --- 5. loadAll --------------------------------------------------------

describe('loadAll', () => {
  test('returns results in order', async () => {
    const result = await loadAll([
      () => after(60, 'user'),
      () => after(30, 'posts'),
      () => after(1, 'stats'),
    ])
    assert.deepEqual(result, ['user', 'posts', 'stats'])
  })

  test('runs concurrently, not sequentially', async () => {
    const start = performance.now()
    await loadAll([() => sleep(100), () => sleep(100), () => sleep(100)])
    const elapsed = performance.now() - start

    atLeast(elapsed, 100, 'loadAll')
    under(elapsed, 250, 'loadAll ran sequentially (3 × 100ms)')
  })

  test('handles an empty list', async () => {
    assert.deepEqual(await loadAll([]), [])
  })
})

// --- 6. getJSON --------------------------------------------------------

describe('getJSON', () => {
  const ok = body => async () => ({
    ok: true,
    status: 200,
    json: async () => body,
  })

  test('returns parsed JSON on success', async () => {
    assert.deepEqual(await getJSON('/x', ok({ id: 1 })), { id: 1 })
  })

  test('classifies a network failure as kind "network"', async () => {
    const cause = new TypeError('Failed to fetch')
    const err = await getJSON('/x', async () => { throw cause }).catch(e => e)

    assert.ok(err instanceof ApiError, 'should throw an ApiError')
    assert.equal(err.kind, 'network')
    assert.equal(err.cause, cause, 'should preserve the original error as `cause`')
  })

  test('classifies a non-2xx response as kind "http" with a status', async () => {
    const fake = async () => ({ ok: false, status: 404, json: async () => ({}) })
    const err = await getJSON('/x', fake).catch(e => e)

    assert.ok(err instanceof ApiError)
    assert.equal(err.kind, 'http', 'a 404 resolves — you must check res.ok yourself')
    assert.equal(err.status, 404)
  })

  test('classifies a bad JSON body as kind "parse"', async () => {
    const cause = new SyntaxError('Unexpected token <')
    const fake = async () => ({
      ok: true,
      status: 200,
      json: async () => { throw cause },
    })
    const err = await getJSON('/x', fake).catch(e => e)

    assert.ok(err instanceof ApiError)
    assert.equal(err.kind, 'parse')
    assert.equal(err.cause, cause)
  })
})
