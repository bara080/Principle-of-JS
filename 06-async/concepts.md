# Concepts — Asynchronous JavaScript

> Status: outline.

## 1. The event loop

- **Call stack** — currently-executing functions.
- **Task queue** (macrotasks) — `setTimeout`, `setInterval`, I/O completions.
- **Microtask queue** — promise callbacks, `queueMicrotask`.
- Order per tick: pop a task → run to completion → drain microtasks → next task.

Microtasks always run before the next macrotask. This is why:

```js
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('sync')

// sync → promise → timeout
```

## 2. Promises

A promise is in one of three states: `pending`, `fulfilled`, `rejected`.

```js
new Promise((resolve, reject) => { ... })
p.then(onFulfilled, onRejected)
p.catch(onRejected)
p.finally(cleanup)
```

Rules:

- A settled promise stays settled forever.
- `then`/`catch` return **new** promises — chainable.
- Throwing inside a `.then` callback rejects the returned promise.

## 3. `async` / `await`

`async` marks a function that always returns a promise. `await` pauses the
function until the awaited promise settles.

```js
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

`try` / `catch` catches both sync throws and rejected awaited promises.

## 4. Combinators

| Combinator                    | Behavior                                            |
| ----------------------------- | --------------------------------------------------- |
| `Promise.all([p1, p2])`       | Rejects on first rejection; else array of results.  |
| `Promise.allSettled([...])`   | Never rejects; array of `{status, value|reason}`.   |
| `Promise.race([...])`         | Settles as soon as *any* promise settles.           |
| `Promise.any([...])`          | Settles on first *fulfilled*; else `AggregateError`.|

Rule of thumb:

- `all` — need every result; failure is total.
- `allSettled` — partial success is fine.
- `race` — enforcing a timeout via a rejecting timer.
- `any` — trying redundant sources.

## 5. Cancellation

```js
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)
await fetch(url, { signal: controller.signal })
```

- `signal` propagates through `fetch`, most Node APIs, and any function that
  accepts it.
- After abort, awaiting the signal-guarded work throws `AbortError`.

## 6. Retry with backoff and jitter

Naïve retries hammer failing services. Real retries:

- Cap the number of attempts.
- Exponential delay (`base * 2^attempt`).
- Jitter (`delay * (0.5 + Math.random() * 0.5)`) — spreads retries out.
- Skip retries for non-retriable errors (4xx client errors).

## 7. Common bugs

- **Awaiting in a loop when parallel would work** — 10 sequential 200ms calls
  = 2s. `Promise.all` = 200ms.
- **Forgotten `await`** — `fetch` returns a promise; using the result directly
  is undefined behavior.
- **Race conditions** — a slow request's response overwriting a newer one.
  Use `AbortController` to cancel the stale one.
- **Uncaught rejection** — Node 15+ crashes the process by default.

## Common Interview Questions

1. Explain the event loop.
2. What order do these logs print? (sync + timeout + promise mix)
3. Implement `Promise.all` from scratch.
4. Difference between `Promise.race` and `Promise.any`.
5. How would you retry a failing fetch with backoff?
6. What is `AbortController`? Show a concrete use.
