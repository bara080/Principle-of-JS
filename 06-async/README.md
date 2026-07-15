# Module 06 — Asynchronous JavaScript

> The event loop is the model. Promises are the plumbing. `async`/`await` is
> the ergonomics. Master all three or you'll fear async code forever.

## Learning Objectives

- Predict output involving `setTimeout`, promises, and microtasks.
- Compose async work with `Promise.all`, `allSettled`, `race`, `any`.
- Use `async`/`await` fluently, including error handling with `try`/`catch`.
- Cancel work with `AbortController` (fetch, timers, custom operations).
- Choose sequential vs parallel execution correctly.
- Fetch data with `fetch`, including retries, timeouts, and JSON parsing.

## Why This Topic Matters

Every backend request, every UI event handler, every I/O operation is async.
Understanding the event loop makes React lifecycles obvious, race conditions
diagnosable, and slow endpoints fixable.

## Where It Is Used In Production

- **Every fetch call.** Every API integration. Every DB query.
- **Rate-limited external APIs** — retry with exponential backoff.
- **Timeouts** — cancel a slow request rather than block a request handler.
- **Parallelism** — `Promise.all` on independent tasks halves your latency.
- **Cancellation** — `AbortController` propagated through fetch to close TCP
  sockets, saving server-side work.

## Prerequisites

Modules 01–02.

## Skills Gained

- Reading async stacks in DevTools without confusion.
- Writing production-safe retries with jitter and timeouts.
- Explaining the event loop clearly enough to pass senior interviews.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3–4 hr · Mini-project: 2 hr.

## Common Mistakes

1. `for (const item of items) await fn(item)` when you meant parallel — huge
   latency loss.
2. `.then(fn)` without a `.catch` — swallowed rejections.
3. `async` functions that forget to `await` inner promises — return `Promise<Promise<T>>`.
4. Retry without a max — infinite loop on persistent failure.
5. Missing timeout on `fetch` — a hung server hangs your service.
6. Race conditions between two `setState` calls — use state functions in React.

## Best Practices

- Every `fetch` gets a timeout (via `AbortController`) and a retry budget.
- Every `.then` chain gets a `.catch` or is `await`-ed inside a `try`.
- Prefer `Promise.allSettled` when partial success is acceptable.
- Wrap each retry attempt in a fresh `AbortController`; sharing signals across
  retries is a bug.

## Mini-Project Overview

**`mini-project/`** — a resilient fetch client with timeout, retry (with jitter),
and cancellation. Same interface as `fetch`, but production-safe.

## Recommended Resources

- [Jake Archibald — In the loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- MDN — Using promises, async functions, AbortController.
- Node.js docs — `fetch`, `AbortSignal.timeout`, `structuredClone`.

## Existing files

Module 06 already has:

- `lesson.js` — starter async examples.
- `combinators.js` — `Promise.all` / `allSettled` / `race` / `any`.
- `abort.js` — cancellation and timeouts.

Keep these; the mini-project builds on them.
