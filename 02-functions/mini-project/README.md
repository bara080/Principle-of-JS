# Mini-Project — Functional Toolkit

Build a small utility library that every production JS codebase eventually
needs: `debounce`, `throttle`, `memoize`, `once`, `pipe`, `compose`.

Ship them as ES modules with `node --test` coverage.

## Files

```text
mini-project/
├── README.md
├── index.js         — public API
└── index.test.js    — tests
```

## Requirements

- **`debounce(fn, ms)`** — delays until quiet. Cancels pending calls when
  invoked again within the window. Preserves `this` and args.
- **`throttle(fn, ms)`** — at most one call per `ms`. Leading and trailing edge.
- **`memoize(fn, keyFn?)`** — caches return values. Default key is
  `JSON.stringify(args)`; override for object args.
- **`once(fn)`** — fires exactly one time, returns the same result on later calls.
- **`pipe(...fns)(x)`** — `fns[n](...fns[1](fns[0](x)))`.
- **`compose(...fns)(x)`** — reverse of pipe.

## Run

```bash
node --test 02-functions/mini-project/index.test.js
```
