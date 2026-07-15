# Async

The round most candidates fall over. Master the event loop, promises,
combinators, and cancellation.

## Common questions

**1. Explain the event loop.**
Call stack (currently executing), macrotask queue (`setTimeout`, I/O),
microtask queue (promise callbacks). Each tick: pop macrotask → run to
completion → drain all microtasks → next macrotask.

**2. What does this log?**

```js
console.log('a')
setTimeout(() => console.log('b'), 0)
Promise.resolve().then(() => console.log('c'))
console.log('d')
```

`a`, `d`, `c`, `b`. Sync first, then microtasks, then macrotasks.

**3. Promise states?**
`pending`, `fulfilled`, `rejected`. Terminal once settled.

**4. `all` vs `allSettled` vs `race` vs `any`?**
`all` — reject on first rejection. `allSettled` — never reject. `race` — first
to settle. `any` — first to fulfill.

**5. How do you cancel a fetch?**

```js
const ac = new AbortController()
setTimeout(() => ac.abort(), 5000)
await fetch(url, { signal: ac.signal })
```

**6. What's a common `await` mistake?**
`for (const item of items) await work(item)` when tasks are independent. Use
`Promise.all(items.map(work))`.

## Whiteboard exercises

See [`exercises.js`](./exercises.js).

## Common mistakes

- Claiming microtasks run "later" — they run *before the next macrotask*.
- Forgetting to `await` in a `map` → array of promises.
- Sharing an `AbortController` across retries.

## Senior-level nuances

- **`.finally` runs regardless.** But it doesn't change the resolution value
  unless it throws or returns a rejected promise.
- **Async iterators** (`for await`) — one microtask flush per iteration; can
  starve the event loop if the source produces synchronously.
- **`queueMicrotask`** — schedule a microtask without wrapping in a promise.
