# Concepts — Testing & Performance

> Status: outline.

## Node's built-in test runner

```js
import { test, describe, before, after, mock } from 'node:test'
import assert from 'node:assert/strict'

describe('parser', () => {
  test('parses valid input', () => {
    assert.equal(parse('42'), 42)
  })
})
```

Run: `node --test file.js` or `node --test 'src/**/*.test.js'`.

## Assertions

- `assert.equal(a, b)` — `==` (avoid).
- `assert.strictEqual(a, b)` — `===`.
- `assert/strict` — makes every assertion strict by default. Prefer.
- `assert.deepEqual(a, b)` — recursive equality for objects/arrays.
- `assert.throws(fn, /pattern/)` — expected throw.
- `assert.rejects(promise, /pattern/)` — expected rejection.

## Mocks and spies

```js
const fn = mock.fn(() => 42)
fn(1, 2)
assert.equal(fn.mock.calls.length, 1)
assert.deepEqual(fn.mock.calls[0].arguments, [1, 2])
```

## Fake timers

```js
mock.timers.enable({ apis: ['setTimeout'] })
setTimeout(callback, 1000)
mock.timers.tick(1000)   // advance
mock.timers.reset()
```

## Async tests

```js
test('resolves', async () => {
  await assert.doesNotReject(work())
})
```

## Performance measurement

```js
const t0 = performance.now()
work()
console.log(`${(performance.now() - t0).toFixed(2)}ms`)

performance.mark('start')
work()
performance.mark('end')
performance.measure('work', 'start', 'end')
```

## Debounce vs throttle

- **Debounce** — collapse a burst of calls into one; fires **after** silence.
- **Throttle** — rate-limit to at most one call per N ms.

Autocomplete → debounce. Scroll analytics → throttle.

## Memory leaks

- Detached DOM held by a JS reference.
- Event listeners never removed.
- Closures holding large scopes for no reason.
- Timers with references to large state.

## Common Interview Questions

1. Implement debounce.
2. Implement throttle.
3. Difference between them?
4. How would you test a function that calls `setTimeout`?
5. How do you profile a slow React component?
