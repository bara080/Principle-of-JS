# Notes from Screenshots

Knowledge extracted from 17 saved screenshots, ordered by capture date
(Jan–Jul 2026). Duplicate topics are merged at their first appearance and
flagged where revisited.

The arc: a roadmap in January, then functions and errors in spring, then a
long run at **asynchronous JavaScript** — sync vs async, callbacks, promises,
async/await, the event loop, and `fetch`. That's the spine of this collection.

---

## Jan 13 — The roadmap

What to be comfortable with, in order:

**Foundation** — hoisting · `this` · call stack and event loop
**Core** — closures · array methods · immutability
**Functions & scope** — parameters and arguments · return values · scope ·
callbacks · higher-order functions
**Async** — promises · async/await · `fetch` · `.then`/`.catch` · error handling
**Advanced** — closures · `this` · ternary · short-circuit evaluation ·
optional chaining · nullish coalescing

---

## Apr 5 — Types of functions

*(Revisited Jul 5 with the same nine categories — it stuck.)*

| Type | Defining trait |
|---|---|
| Declaration | `function greet() {}` — fully hoisted |
| Expression | `const greet = function () {}` — not hoisted |
| Arrow | `const greet = () => 'Hi'` — no own `this` |
| Anonymous | No name; common in callbacks |
| IIFE | `(function () {})()` — runs immediately |
| Callback | Passed as an argument, run later |
| Higher-order | Takes or returns a function |
| Constructor | Called with `new`, assigns to `this` |
| Generator | `function* g() { yield 1 }` — pauses via `yield` |
| Async | Returns a promise; enables `await` |

```js
// Hoisting is the practical difference between the first two
greet()                        // works
function greet() {}

greet()                        // ReferenceError
const greet = function () {}
```

---

## May 1 — Error handling

`try` runs risky code · `catch` handles it · `finally` always runs (cleanup) ·
`throw` creates the error.

```js
try {
  throw new Error('Something went wrong')
} catch (err) {
  console.log(err)
} finally {
  console.log('Done')          // runs whether or not it threw
}
```

**Custom errors** — subclass `Error` so callers can branch on type:

```js
class InvalidLoginError extends Error {
  constructor() {
    super('Invalid credentials')
    this.name = 'InvalidLoginError'
  }
}
```

**Catch as `unknown`, not `any`** — forces you to narrow before use:

```js
try {
  throw new Error('Fail')
} catch (err) {              // err: unknown in TypeScript
  if (err instanceof Error) console.log(err.message)
}
```

**Async errors need `await`.** Without it, the promise rejects outside the
`try` block and `catch` never fires:

```js
async function getData() { throw new Error('API failed') }

async function test() {
  try {
    await getData()          // drop the await and this is uncatchable here
  } catch (e) {
    console.log('Handled:', e)
  }
}
```

Throw `Error` objects or custom errors. Never throw strings — you lose the
stack trace.

---

## May 20 — Modern syntax (ES6+)

```js
// let / const — block-scoped; const cannot be reassigned
if (true) { let x = 10; const y = 20 }   // x, y not visible outside

// Arrow — shorter, and no own `this`, `arguments`, or `super`
const add = (a, b) => a + b

// Template literals
const msg = `Hello, ${user}!`

// Destructuring
const [a, b, ...rest] = [1, 2, 3, 4]
const { name, age } = { name: 'Sam', age: 30 }

// Spread — copy, merge, pass
const newObj = { ...obj, c: 3 }

// Default parameters
const greet = (name = 'Guest') => `Hello, ${name}!`

// Rest parameters — gather into an array
const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0)

// Enhanced object literals — no repeating keys
const obj = { name, age, sayHello() { return `Hi, I'm ${name}` } }

// Modules
export const add = (a, b) => a + b
import { add } from './math.js'

// Optional chaining — safe access
console.log(user.address?.city)          // undefined, not a crash

// Nullish coalescing — fallback only for null/undefined
const city = user.address?.city ?? 'Unknown City'
```

---

## Jun 12 — Synchronous vs asynchronous

Synchronous code runs line by line and waits for each task. Asynchronous code
doesn't wait — it hands long-running work off and keeps going.

```js
console.log('Start')
setTimeout(() => console.log('Middle'), 1000)
console.log('End')

// Start
// End
// Middle
```

| Synchronous | Asynchronous |
|---|---|
| One task at a time | Doesn't wait |
| Waits for completion | Continues execution |
| Simpler flow | Better for I/O |
| Can freeze the UI | Keeps UI responsive |

**Key point:** JavaScript is single-threaded. Async behavior is possible only
through the event loop.

---

## Jun 21 — Callbacks

A callback is a function passed as an argument to another function, executed
after that function's task completes.

```js
function greet(name, callback) {
  console.log(`Hello, ${name}!`)
  callback()
}

greet('Alice', () => console.log('Goodbye!'))
```

The analogy: you order food (function A) and leave your phone number
(the callback). When the food is ready, the restaurant calls you.

Used for API calls, file reads, timers, DOM events, animations. Callbacks are
why JavaScript can be non-blocking at all.

**The cost:** nesting them for sequential work produces *callback hell* —
hard to read, harder to handle errors in. That problem is what promises exist
to solve.

---

## Jun 5 — Promises

A promise represents a value that may be available now, later, or never.

**Three states:** `pending` (initial) → `fulfilled` (resolved successfully) or
`rejected` (failed).

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    success ? resolve('Success!') : reject('Error!')
  }, 1000)
})

promise
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

---

## Jun 5 — Async / await

Makes asynchronous code look like normal code.

- `async` makes a function return a promise.
- `await` waits for a promise to settle before moving to the next line.
- `await` only works inside an `async` function.

```js
// Without
fetchData().then(data => console.log(data))

// With
async function getData() {
  const data = await fetchData()
  console.log(data)
}
```

*(Revisited Jun 12 as a direct comparison.)*

| Promise | Async/await |
|---|---|
| `.then()` / `.catch()` | `async` / `await` keywords |
| Chains of callbacks | Reads like synchronous code |
| Harder to read for complex flows | Easier to read and maintain |
| Better for parallel work | Better for sequential work |
| Errors via `.catch()` | Errors via `try`/`catch` |

Async/await is *built on* promises — it's syntax, not a replacement. Reach for
raw promises when you need `Promise.all()` or `Promise.race()` to run work in
parallel; reach for `await` when steps depend on each other.

**Common mistakes**

- Forgetting `await` → you get a Promise, not the value.
- No `catch` → unhandled promise rejection.
- `async` without `try`/`catch` → errors are harder to trace.
- Mixing `.then()` and `await` in one flow → messy.

---

## Jun 5 — The event loop

The mechanism that lets single-threaded JavaScript do non-blocking I/O. It
watches the call stack, and when the stack is empty, pushes the next queued
callback onto it.

**Call Stack → Web APIs → Callback Queue → Event Loop → back to Call Stack**

- **Call stack** — where code executes, one task at a time.
- **Web APIs** — handle `setTimeout`, DOM events, `fetch`.
- **Callback queue** — holds callbacks ready to run.
- **Event loop** — if stack is empty, move the next task onto it.

**Microtasks beat macrotasks.** After each macrotask, the loop *drains every*
microtask before touching the next macrotask.

| Microtasks (higher priority) | Macrotasks (lower priority) |
|---|---|
| `Promise.then/catch/finally` | `setTimeout` / `setInterval` |
| `queueMicrotask()` | DOM events |
| `MutationObserver` | I/O callbacks |
| `process.nextTick` (Node) | `setImmediate` (Node) |

```js
console.log('Start')                              // 1
setTimeout(() => console.log('Timer'), 0)         // 2
Promise.resolve().then(() => console.log('Promise')) // 3
console.log('End')                                // 4

// Start → End → Promise → Timer
```

Why: `Start` and `End` are synchronous, so they run first. `.then()` is a
microtask, so it beats `setTimeout`, which is a macrotask — even at `0ms`,
because it must wait for the stack to clear and the microtasks to drain.

In Node, `process.nextTick` outranks `Promise.then`, though both are microtasks.

---

## Jun 28 — `fetch()`

JavaScript's way to call APIs. It sends a request and returns a promise for
the response.

```js
const url = 'https://jsonplaceholder.typicode.com/users'

async function fetchUsers() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const users = await res.json()
    console.log(users)
  } catch (err) {
    console.log('Something went wrong!', err)
  }
}
```

| Method | Purpose |
|---|---|
| `fetch(url)` | Make a request |
| `res.json()` | Parse JSON response |
| `res.text()` | Parse text response |
| `res.ok` | Was the request successful? |

**`fetch` does not throw on HTTP errors.** A 404 or 500 still resolves — only
network failures reject. Check `res.ok` yourself, or your `catch` will never
see a bad status.

---

## Mar 13 — Levels of API calling

Three tiers of the same request, worst to best:

```js
// OK — manual fetch, stringify, no caching or loading state
async function sync() {
  const res = await fetch('/sync-steps', {
    method: 'POST',
    body: JSON.stringify({ lastSyncAt: lastSyncDate }),
  })
  return res.json()
}

// BETTER — a query library gives you caching, loading, and error states
const { isLoading, data } = useQuery({
  queryKey: ['sync-steps'],
  queryFn: () => fetch('/sync-steps', { method: 'POST' }).then(r => r.json()),
  enabled: false,
})

// BEST — a typed RPC client: the route and payload are checked at compile time
async function sync() {
  const res = await honoApi.api.steps.sync.$post({
    json: { lastSyncAt: lastSyncDate },
  })
  return await res.json()
}
```

The progression is about *what the compiler and library do for you* — from
hand-rolling everything, to delegating state management, to making a wrong
request unrepresentable.

---

## Adjacent notes

Two screenshots aren't JavaScript, kept here for completeness.

**Backend skills (May 18)** — REST + gRPC · modern auth (passkeys over JWT) ·
SQL + NoSQL · Redis caching · Kafka-level event systems · async and reactive
code · microservices and service mesh · OWASP and zero trust · OpenTelemetry.

**What happens when you call an LLM API (Mar 31)** — a ~400ms journey through
14 layers: API gateway (TLS, auth, rate limiting) → load balancer → tokenization
(token count is your cost) → model router → inference engine (prefill phase,
then autoregressive decode, which is why streaming exists) → post-processing
and safety filter → response and billing. Inference is ~95% of the wait.

---

## Where this connects to the repo

The async cluster maps onto [Module 6](README.md#module-6--asynchronous-javascript),
which is the module you've started in [06-async/lesson.js](06-async/lesson.js).
Error handling is [Module 8](README.md#module-8--error-handling--debugging);
function types are [Module 2](README.md#module-2--functions-deep-dive).

Not yet covered by any screenshot, but on the Module 6 checklist:
`Promise.all` / `allSettled` / `race` / `any`, and `AbortController`.
