# Task — Test Your Knowledge

Exercises drawn from [notes-from-screenshots.md](notes-from-screenshots.md).
Answers are collapsed at the bottom. **Write your answer down before opening
one** — recognizing a solution feels like knowing it, and isn't.

Run anything with `node file.js`.

| Part | Focus | Tasks |
|---|---|---|
| 1 | Predict the output | 5 |
| 2 | Find the bug | 4 |
| 3 | Write the code | 6 |
| 4 | Explain it out loud | 8 |

---

## Part 1 — Predict the output

Write the exact output, in order, before running anything.

**1.1**
```js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
```

**1.2**
```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => {
  console.log('3')
  setTimeout(() => console.log('4'), 0)
})
queueMicrotask(() => console.log('5'))
console.log('6')
```

**1.3**
```js
async function f() {
  console.log('start')
  await null
  console.log('after await')
}

console.log('before')
f()
console.log('after')
```

**1.4**
```js
greet()
hello()

function greet() { console.log('greet') }
var hello = function () { console.log('hello') }
```

**1.5**
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0)
```

---

## Part 2 — Find the bug

Each snippet is wrong. Say what breaks, why, and fix it.

**2.1 — The error that vanishes**
```js
async function getData() {
  throw new Error('API failed')
}

async function main() {
  try {
    getData()
  } catch (e) {
    console.log('Handled:', e.message)
  }
}
```

**2.2 — The 404 that looks like success**
```js
async function getUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`)
    return await res.json()
  } catch (err) {
    console.log('Request failed')
  }
}
```

**2.3 — The premature "done"**
```js
async function saveAll(items) {
  items.forEach(async item => {
    await save(item)
  })
  console.log('All saved')
}
```

**2.4 — The slow one**
```js
// Each fetch takes about 1 second.
async function loadDashboard() {
  const user = await fetchUser()
  const posts = await fetchPosts()
  const stats = await fetchStats()
  return { user, posts, stats }
}
```
It works, and takes 3 seconds. It should take 1. Why, and what's the fix?

---

## Part 3 — Write the code

**3.1 — `delay(ms)`**
Return a promise that resolves after `ms` milliseconds. Then use it to log
three messages one second apart.

**3.2 — Parallel fetch**
Fetch three URLs at once with `Promise.all` and return an array of parsed JSON.
What happens if one fails? Make a second version using `Promise.allSettled` that
returns the successes and reports the failures.

**3.3 — `fetchWithRetry(url, retries)`**
Fetch a URL. On failure, retry up to `retries` times before giving up. Treat a
non-2xx status as a failure. Add exponential backoff between attempts.

*(This is the Module 6 exercise from the README.)*

**3.4 — `promiseAll(promises)`**
Reimplement `Promise.all` from scratch using only `new Promise`. It must:
resolve with results **in input order** regardless of settle order; reject
immediately on the first rejection; resolve with `[]` on an empty array.

**3.5 — `ApiError`**
Write a `getJSON(url)` that classifies failure into three kinds — `network`,
`http`, `parse` — and throws a custom `ApiError` carrying the kind, the status
where relevant, and the original error as `cause`.

**3.6 — `memoize(fn)`**
A higher-order function returning a cached version of `fn`. Prove it works by
timing a slow function twice.

---

## Part 4 — Explain it out loud

No code. Answer in a sentence or two, as if to an interviewer.

1. JavaScript is single-threaded. So how is it non-blocking?
2. What are the three states of a promise?
3. Why does `setTimeout(fn, 0)` not run immediately?
4. A microtask and a macrotask are both queued. Which runs first, and why?
5. What does `async` do to a function's return value?
6. Where can you use `await`, and where can't you?
7. `fetch` gets a 500 response. Does the promise reject?
8. Async/await is "better" than promises. Where is that claim wrong?

---

## Cheat Code

Quick reference. Consult *after* attempting, or while writing Part 3.

### Event loop order
```
1. Run all synchronous code (call stack empties)
2. Drain ALL microtasks
3. Run ONE macrotask
4. Drain ALL microtasks again
5. Repeat from 3
```

| Microtask (first) | Macrotask (second) |
|---|---|
| `.then` / `.catch` / `.finally` | `setTimeout` / `setInterval` |
| `queueMicrotask()` | DOM events |
| `await` (resumption) | I/O callbacks |
| `process.nextTick` (Node, first of all) | `setImmediate` (Node) |

### Promise combinators
| | Resolves when | Rejects when |
|---|---|---|
| `all` | **all** fulfill | **any** rejects (fail fast) |
| `allSettled` | all settle | never |
| `race` | first **settles** | first settles, if rejected |
| `any` | first **fulfills** | all reject (`AggregateError`) |

```js
const [a, b] = await Promise.all([fa(), fb()])         // all-or-nothing
const rs = await Promise.allSettled([fa(), fb()])       // [{status, value|reason}]
```

### Sequential vs parallel
```js
await a(); await b()                  // 2s — b starts after a finishes
await Promise.all([a(), b()])         // 1s — both start immediately

const pa = a(), pb = b()              // also 1s — calling starts the work
await pa; await pb                    //   `await` only observes it
```
**A promise starts running the moment it's created**, not when awaited.

### fetch
```js
const res = await fetch(url)
if (!res.ok) throw new Error(`HTTP ${res.status}`)   // fetch does NOT throw on 4xx/5xx
const data = await res.json()
```
Only a *network* failure rejects. A 404 is a perfectly successful response
about a missing thing.

### Errors
```js
try { risky() } catch (e) { handle(e) } finally { cleanup() }  // finally always runs

class ApiError extends Error {
  constructor(msg, opts) { super(msg, opts); this.name = 'ApiError' }
}
throw new ApiError('boom', { cause: originalError })   // never throw a string
```
`await` inside `try` or the rejection escapes the block uncaught.

### Hoisting
```js
declared()                     // works — fully hoisted
function declared() {}

expressed()                    // TypeError: not a function
var expressed = function () {} // var hoisted as undefined

lexical()                      // ReferenceError — temporal dead zone
let lexical = function () {}
```

### `this`
Arrow functions have **no own `this`** — they inherit it from the enclosing
scope. That's why they're safe in callbacks and wrong as object methods.

---

## Answer Key

<details>
<summary><b>Part 1 — Predict the output</b></summary>

**1.1** → `A`, `D`, `C`, `B`

`A` and `D` are synchronous. `C` is a microtask. `B` is a macrotask, and
macrotasks wait for every microtask to drain — even at `0ms`.

**1.2** → `1`, `6`, `3`, `5`, `2`, `4`

Sync: `1`, `6`. Microtasks drain in queue order: `3`, then `5`. Then the first
macrotask, `2`. The `setTimeout` for `4` was only queued once `3` ran, so it
lands behind `2`.

**1.3** → `before`, `start`, `after`, `after await`

Calling `f()` runs its body **synchronously** until the first `await` — so
`start` prints immediately. `await` then suspends the function and queues the
remainder as a microtask, letting `after` run. `await null` still yields a tick,
even though `null` isn't a promise.

**1.4** → `greet`, then `TypeError: hello is not a function`

Function *declarations* hoist entirely. `var hello` hoists as `undefined`; the
assignment hasn't happened yet, so you're calling `undefined()`. With `let` or
`const` it'd be a `ReferenceError` instead — the temporal dead zone.

**1.5** → `3`, `3`, `3`, then `0`, `1`, `2`

`var` is function-scoped: all three callbacks close over the *same* `i`, which
is `3` by the time they run. `let` is block-scoped and gets a fresh binding per
iteration. The classic closure trap.

</details>

<details>
<summary><b>Part 2 — Find the bug</b></summary>

**2.1** — Missing `await`. `getData()` returns a rejected promise, but `try`
has already exited by the time it rejects, so `catch` never fires and you get
an unhandled rejection. Fix: `await getData()`.

**2.2** — Never checks `res.ok`. A 404 or 500 resolves normally, so `catch`
doesn't run and you return the error body as if it were a user. `catch` here
only sees network failures. Fix:
```js
const res = await fetch(`/api/users/${id}`)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
```

**2.3** — `forEach` ignores the promise each async callback returns. It fires
all of them and moves on, so `All saved` logs before anything is saved. Fix,
depending on intent:
```js
for (const item of items) await save(item)     // sequential
await Promise.all(items.map(save))              // parallel
```

**2.4** — Each `await` blocks the next call from *starting*. The three fetches
don't depend on each other, so run them concurrently:
```js
const [user, posts, stats] = await Promise.all([
  fetchUser(), fetchPosts(), fetchStats(),
])
```
Sequential `await` is only correct when a later call needs an earlier result.

</details>

<details>
<summary><b>Part 3 — Write the code</b></summary>

**3.1**
```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  console.log('one')
  await delay(1000)
  console.log('two')
  await delay(1000)
  console.log('three')
}
```
Note `resolve` is passed directly to `setTimeout` — no wrapper needed.

**3.2**
```js
async function fetchAll(urls) {
  const responses = await Promise.all(urls.map(u => fetch(u)))
  return Promise.all(responses.map(r => r.json()))
}
```
If one fails, `Promise.all` rejects immediately and you lose the successes.

```js
async function fetchAllSettled(urls) {
  const results = await Promise.allSettled(
    urls.map(async u => {
      const res = await fetch(u)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    }),
  )
  const data = results.filter(r => r.status === 'fulfilled').map(r => r.value)
  const errors = results.filter(r => r.status === 'rejected').map(r => r.reason)
  if (errors.length) console.warn(`${errors.length} failed`, errors)
  return data
}
```

**3.3**
```js
async function fetchWithRetry(url, retries = 3, backoff = 300) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      await delay(backoff * 2 ** (attempt - 1))   // 300ms, 600ms, 1200ms…
    }
  }
}
```
Retrying a 404 is pointless — it'll never succeed. A production version would
retry only on network errors and 5xx.

**3.4**
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let settled = 0

    if (promises.length === 0) return resolve(results)

    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value              // index, not push — preserves order
        if (++settled === promises.length) resolve(results)
      }, reject)                        // first rejection wins; later ones no-op
    })
  })
}
```
Three traps: `push` would order by *settle* time, not input order. The empty
array must resolve, not hang. And `Promise.resolve(p)` lets non-promise values
through, as the real one does.

**3.5**
```js
class ApiError extends Error {
  constructor(message, { kind, status, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.kind = kind        // 'network' | 'http' | 'parse'
    this.status = status
  }
}

async function getJSON(url) {
  let res
  try {
    res = await fetch(url)
  } catch (cause) {
    throw new ApiError('Network failure', { kind: 'network', cause })
  }

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, { kind: 'http', status: res.status })
  }

  try {
    return await res.json()
  } catch (cause) {
    throw new ApiError('Invalid JSON', { kind: 'parse', cause })
  }
}
```
Each `try` wraps exactly one failure mode. One big `try` around all three would
make them indistinguishable — which is the whole point of the exercise.

**3.6**
```js
function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const slow = n => { for (let i = 0; i < 1e9; i++); return n * 2 }
const fast = memoize(slow)

console.time('first');  fast(21); console.timeEnd('first')   // ~250ms
console.time('second'); fast(21); console.timeEnd('second')  // ~0.02ms
```
`cache` survives because the returned closure holds a reference to it. That's
closures earning their keep. The `JSON.stringify` key is a pragmatic hack —
it fails on functions, `undefined`, and key order.

</details>

<details>
<summary><b>Part 4 — Explain it out loud</b></summary>

1. **Non-blocking despite one thread.** Long-running work is handed to Web APIs
   (or Node's libuv), which run outside the JS thread. Their callbacks queue up,
   and the event loop pushes them onto the call stack once it's empty. JS never
   waits — it delegates.

2. **`pending` → `fulfilled` or `rejected`.** Once settled, a promise is
   immutable; it can't change state again.

3. **`setTimeout(fn, 0)`** queues `fn` as a macrotask. It can't run until the
   call stack is empty *and* every microtask has drained. `0` is a minimum
   delay, not a promise of immediacy.

4. **The microtask.** After each macrotask the loop drains the microtask queue
   completely before taking the next macrotask. In Node, `process.nextTick`
   outranks even `Promise.then`.

5. **`async` wraps the return value in a promise.** `return 'Hello'` from an
   async function gives you `Promise<'Hello'>`. A `throw` gives a rejected
   promise.

6. **`await` works inside `async` functions**, and at the top level of an ES
   module. Not in a plain function, not in a `forEach` callback — well, it works
   *syntactically* in an async callback, but `forEach` throws the promise away
   (see 2.3).

7. **No.** A 500 resolves. `fetch` rejects only on network failure — DNS,
   offline, CORS, abort. You must check `res.ok` yourself. This is the single
   most common `fetch` bug.

8. **Where it's wrong:** async/await *is* promises — syntax over the same
   machinery. It's better for sequential, dependent steps and for `try`/`catch`.
   It's worse when you want concurrency, because a chain of `await`s serializes
   work that could overlap. And `Promise.all` / `race` / `any` have no `await`
   equivalent. The right framing isn't "which is better" but "am I doing these
   one after another, or all at once?"

</details>

---

## Scoring

| Score | Where you are |
|---|---|
| Part 1 clean | You understand the event loop. Most people don't. |
| Part 2 clean | You'll catch these in code review. |
| 3.4 clean | You understand promises as a data structure, not a spell. |
| Part 4 clean | You can pass the async round of an interview. |

Stuck on Part 1? Reread [the event loop notes](notes-from-screenshots.md#jun-5--the-event-loop).
Stuck on Part 3? The [cheat code](#cheat-code) above is enough to unstick you
without giving the answer away.

**Next:** `AbortController` and cancellation appear on the
[Module 6 checklist](README.md#module-6--asynchronous-javascript) and in none
of these tasks. That's the gap to close after this.
