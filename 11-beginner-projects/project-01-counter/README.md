# Project 01 — Counter App

Build a click-counter widget. Ships as a pure state module (testable in Node)
and a thin DOM binding (runs in a browser).

## Acceptance criteria

- `createCounter({ initial = 0, step = 1 })` returns
  `{ increment, decrement, reset, read, subscribe }`.
- `subscribe(fn)` runs `fn(value)` on every change; returns an unsubscribe fn.
- The DOM shell in `assets/index.html` wires the counter to `+`, `-`, `reset`
  buttons. State survives page reload via `localStorage`.

## Files

```text
project-01-counter/
├── README.md
├── src/
│   ├── counter.js   — pure state module
│   └── dom.js       — DOM wiring
├── tests/
│   └── counter.test.js
├── assets/
│   └── index.html   — the shell (open in browser)
└── solution/
    └── counter.js   — reference
```

## Run

```bash
node --test 11-beginner-projects/project-01-counter/tests/
```
