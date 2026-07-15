# Cheatsheet — Async

## Promise essentials

```js
Promise.resolve(v) / Promise.reject(err)
p.then(onFulfilled).catch(onRejected).finally(cleanup)
await p
```

## Async functions

```js
async function fn() { return 42 }              // returns Promise<42>
async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

## Combinators

```js
await Promise.all([a, b, c])                    // all-or-nothing
await Promise.allSettled([a, b, c])             // never rejects
await Promise.race([work, timeout(5000)])       // first to settle wins
await Promise.any([mirrorA, mirrorB])           // first to fulfill wins
```

## Timeout via race

```js
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error('timeout')), ms),
)
await Promise.race([task(), timeout(3000)])
```

## AbortController

```js
const ac = new AbortController()
setTimeout(() => ac.abort(), 5000)
const res = await fetch(url, { signal: ac.signal })

// Or: AbortSignal.timeout(ms) — one-shot
await fetch(url, { signal: AbortSignal.timeout(5000) })
```

## Retry with backoff + jitter

```js
async function retry(fn, { attempts = 3, base = 200 } = {}) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try { return await fn() }
    catch (err) {
      lastErr = err
      const delay = base * 2 ** i * (0.5 + Math.random() * 0.5)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw lastErr
}
```

## Sequential vs parallel

```js
// Sequential — slow when tasks are independent
for (const url of urls) results.push(await fetch(url))

// Parallel — do this instead
const results = await Promise.all(urls.map(fetch))
```

## Interview tips

- Microtasks (`.then`) run before the next macrotask (`setTimeout`).
- `try` / `catch` around `await` catches both sync throws and rejected promises.
- `AbortController` is the canonical answer for cancellation.
