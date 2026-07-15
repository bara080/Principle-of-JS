# Mini-Project — Timing Toolkit

Build `debounce`, `throttle`, and a `bench(name, fn, n)` micro-benchmark.
Test with Node's fake timers to verify timing behavior deterministically.

## API

```js
debounce(fn, ms, { leading?: boolean }) → debounced fn with .cancel()
throttle(fn, ms, { trailing?: boolean }) → throttled fn with .cancel()
bench(name, fn, iterations) → Promise<{ name, iterations, totalMs, perOpMs }>
```

## Requirements

- Debounced/throttled functions preserve `this` and arguments.
- Both have a `.cancel()` method to clear the pending timer.
- `bench` warms the JIT with a small number of runs first.
- Tests use `mock.timers` — no real waiting.

Run: `node --test 09-testing-performance/mini-project/index.test.js`.
