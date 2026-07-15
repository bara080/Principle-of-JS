# System Design (Lite)

Small-scope system design questions common in senior JS interviews.

## Canonical problems

### 1. Implement `debounce(fn, ms)`

```js
function debounce(fn, ms) {
  let t
  return function debounced(...args) {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), ms)
  }
}
```

Extensions to expect:

- Leading edge: fire on first call, then debounce further.
- Trailing edge with cancel: `debounced.cancel()`.

### 2. Implement `throttle(fn, ms)`

```js
function throttle(fn, ms) {
  let last = 0
  return function throttled(...args) {
    const now = Date.now()
    if (now - last >= ms) { last = now; fn.apply(this, args) }
  }
}
```

Extensions: trailing edge, `.cancel()`.

### 3. Implement `EventEmitter`

```js
class EventEmitter {
  #handlers = new Map()
  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set())
    this.#handlers.get(event).add(fn)
    return () => this.off(event, fn)
  }
  off(event, fn) { this.#handlers.get(event)?.delete(fn) }
  emit(event, ...args) {
    for (const fn of this.#handlers.get(event) ?? []) fn(...args)
  }
}
```

### 4. Implement `Promise.all`

```js
function all(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length)
    let done = 0
    if (promises.length === 0) return resolve([])
    promises.forEach((p, i) =>
      Promise.resolve(p).then(
        (v) => { results[i] = v; if (++done === promises.length) resolve(results) },
        reject,
      ),
    )
  })
}
```

### 5. Rate limiter

Token bucket. Per-user, refill rate + burst capacity. Return `{ allowed, retryAfterMs }`.

### 6. Retry with exponential backoff + jitter

Cap attempts, exponential base, uniform jitter, respect `AbortSignal`.

## Common mistakes

- `debounce` and `throttle` swapped.
- `EventEmitter` that leaks handlers because there's no `off`.
- `Promise.all` that resolves in the wrong order (use the index).

## Senior-level nuances

- Debounce **defers** until quiet; throttle **rate-limits** to one call per interval.
- Rate limiter APIs typically expose `retryAfterMs` so clients can honor `Retry-After` headers.
- Publish-subscribe scaling: replace a `Set` of handlers with a fan-out queue
  when handler counts are high.
