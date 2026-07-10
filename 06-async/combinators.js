// Module 6 — Promise combinators
// Run: node 06-async/combinators.js
//
// Four ways to wait on several promises at once. The differences only show up
// when something fails or one is much slower than the others.

const delay = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms))
const fail = (ms, reason) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(reason)), ms))

// A promise starts running the moment it is CREATED, not when it is awaited.
// So these three overlap: the whole batch takes ~300ms, not 600ms.
async function all() {
  const start = performance.now()

  const results = await Promise.all([
    delay(100, 'user'),
    delay(200, 'posts'),
    delay(300, 'stats'),
  ])

  console.log('all:', results, `in ${Math.round(performance.now() - start)}ms`)
  // → ['user', 'posts', 'stats'] in ~300ms — the slowest one sets the pace
}

// Promise.all is all-or-nothing. One rejection discards every result,
// including the ones that already succeeded.
async function allRejects() {
  try {
    await Promise.all([delay(50, 'saved'), fail(10, 'disk full')])
  } catch (err) {
    console.log('all (rejected):', err.message)
    // 'saved' is gone. If you needed it, you needed allSettled.
  }
}

// allSettled never rejects. You get an entry per input describing what happened.
async function allSettled() {
  const results = await Promise.allSettled([
    delay(50, 'saved'),
    fail(10, 'disk full'),
  ])

  console.log('allSettled:', results)
  // → [{ status: 'fulfilled', value: 'saved' },
  //    { status: 'rejected',  reason: Error }]

  const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value)
  const bad = results.filter(r => r.status === 'rejected').map(r => r.reason.message)
  console.log('  kept:', ok, '| lost:', bad)
}

// race settles with whichever finishes FIRST — success or failure.
// A fast rejection beats a slow success.
async function race() {
  console.log('race:', await Promise.race([delay(10, 'fast'), delay(100, 'slow')]))

  try {
    await Promise.race([delay(100, 'slow'), fail(10, 'timeout')])
  } catch (err) {
    console.log('race (rejected):', err.message, '— a fast failure wins too')
  }
}

// any waits for the first SUCCESS, ignoring rejections along the way.
// It rejects only if every input rejects.
async function any() {
  console.log('any:', await Promise.any([fail(10, 'mirror down'), delay(50, 'backup')]))

  try {
    await Promise.any([fail(10, 'a'), fail(20, 'b')])
  } catch (err) {
    console.log('any (rejected):', err.constructor.name)
    console.log('  individual errors:', err.errors.map(e => e.message))
    // AggregateError — carries every failure in .errors
  }
}

// The classic use for race: bound how long you'll wait for anything.
// (For fetch specifically, prefer AbortSignal.timeout — see abort.js.)
async function timeout() {
  const withTimeout = (promise, ms) =>
    Promise.race([promise, fail(ms, `timed out after ${ms}ms`)])

  try {
    await withTimeout(delay(500, 'eventually'), 100)
  } catch (err) {
    console.log('timeout:', err.message)
  }
  // Note: the slow promise keeps running. race doesn't cancel the loser,
  // it just stops caring. Real cancellation needs AbortController.
}

console.log(`
| Combinator | Resolves when      | Rejects when              |
|------------|--------------------|---------------------------|
| all        | ALL fulfill        | ANY rejects (fail fast)   |
| allSettled | all settle         | never                     |
| race       | first SETTLES      | first settles, if rejected|
| any        | first FULFILLS     | all reject (AggregateError)|
`)

await all()
await allRejects()
await allSettled()
await race()
await any()
await timeout()
