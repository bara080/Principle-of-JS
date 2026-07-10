// Module 6 — AbortController and cancellation
// Run: node 06-async/abort.js
//
// Promise.race can stop you WAITING for something. It cannot stop the thing
// from happening. The request stays open, the timer keeps ticking, the work
// keeps burning CPU. AbortController is how you actually cancel.

// An AbortController owns a signal. Anything holding the signal can listen for
// the abort, and the controller triggers it.
function basics() {
  const controller = new AbortController()
  const { signal } = controller

  signal.addEventListener('abort', () => {
    console.log('basics: aborted, reason =', signal.reason.message ?? signal.reason)
  })

  console.log('basics: aborted before?', signal.aborted) // false
  controller.abort(new Error('user clicked cancel'))
  console.log('basics: aborted after? ', signal.aborted) // true
}

// Make your own async work cancellable: accept a signal, and wire it up.
// Three things every abortable function should do.
function cancellableDelay(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    // 1. Reject immediately if the signal is ALREADY aborted.
    if (signal?.aborted) return reject(signal.reason)

    const id = setTimeout(resolve, ms)

    // 2. On abort, clean up the resource and reject.
    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject(signal.reason)
    }, { once: true })

    // 3. (If the work could finish first, remove the listener — `once` does it.)
  })
}

async function cancelOurOwnWork() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(new Error('too slow')), 50)

  try {
    await cancellableDelay(5000, { signal: controller.signal })
    console.log('cancel: finished')          // never runs
  } catch (err) {
    console.log('cancel:', err.message)      // 'too slow' — after ~50ms, not 5s
  }
}

// An aborted fetch rejects with an AbortError. Distinguish it from a real
// failure: a cancellation is something YOU did, not an error to report.
async function cancelFetch() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 1) // abort almost immediately

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      signal: controller.signal,
    })
    console.log('fetch: got', res.status)
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('fetch: cancelled on purpose — not an error to surface')
    } else {
      console.log('fetch: real failure —', err.message)
    }
  }
}

// Timeouts are the most common reason to abort. Two built-ins do the plumbing:
//
//   AbortSignal.timeout(ms)   — a signal that aborts itself after ms
//   AbortSignal.any([...])    — one signal that aborts when ANY input does
//
// This is strictly better than the Promise.race timeout in combinators.js,
// because the request is genuinely torn down rather than merely ignored.
async function timeoutAndManualCancel() {
  const userCancel = new AbortController()

  const signal = AbortSignal.any([
    AbortSignal.timeout(2000),   // give up after 2s
    userCancel.signal,           // ...or when the user hits cancel
  ])

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', { signal })
    const users = await res.json()
    console.log('combined: fetched', users.length, 'users')
  } catch (err) {
    // TimeoutError when the deadline hit; AbortError when the user cancelled.
    console.log(`combined: ${err.name} — ${err.message}`)
  }
}

// Why this matters: without cancellation, a user who types "a", "ab", "abc"
// fires three searches. They can land out of order, and the response for "a"
// may arrive last and overwrite the results for "abc". Abort the previous
// request on every keystroke and the race disappears.
function searchBoxPattern() {
  let inFlight = null

  return async function search(query) {
    inFlight?.abort()                    // cancel the previous search
    inFlight = new AbortController()

    try {
      const res = await fetch(`/api/search?q=${query}`, { signal: inFlight.signal })
      return await res.json()
    } catch (err) {
      if (err.name === 'AbortError') return null  // superseded; ignore it
      throw err
    }
  }
}

basics()
await cancelOurOwnWork()
await cancelFetch()
await timeoutAndManualCancel()
void searchBoxPattern // illustrative — needs a browser and a real endpoint
