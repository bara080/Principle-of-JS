# Event Loop

Deeper than the async chapter. Meant for candidates targeting senior roles.

## Model

- **Call stack** — currently executing functions.
- **Task queue** (macrotasks) — timers, I/O, `MessageChannel`.
- **Microtask queue** — promise callbacks, `queueMicrotask`, mutation observers.
- **Render steps** (browser only) — style, layout, paint. Between macrotasks.

Per tick:
1. Pop one macrotask, run to completion.
2. Drain **all** microtasks.
3. If browser: check if render is due.
4. Repeat.

## Predict-the-output drills

```js
async function a() { console.log(1); await b(); console.log(2) }
async function b() { console.log(3) }
a(); console.log(4)
// 1, 3, 4, 2
```

`await` suspends the async function; the rest resumes as a microtask.

```js
setTimeout(() => console.log('a'), 0)
setImmediate(() => console.log('b'))
process.nextTick(() => console.log('c'))
Promise.resolve().then(() => console.log('d'))
// Node: c, d, a, b  — nextTick before microtasks; both before macrotasks.
```

## Browser vs Node differences

- Node has `process.nextTick` (higher-priority than promises).
- Browser has a well-defined render step; Node doesn't.
- `setImmediate` is a Node-only macrotask that fires after I/O callbacks.

## Senior-level nuances

- **`await` inside a `for...of`** — each `await` yields to microtasks. In hot
  loops with sync-resolvable promises, this can starve macrotasks.
- **Long-task budgets** — a task taking >50ms blocks the UI (browser).
  Break work with `scheduler.postTask` or `MessageChannel`.
- **`queueMicrotask` vs `Promise.resolve().then`** — same queue, but
  `queueMicrotask` avoids allocating a promise.
