# Concepts — Error Handling & Debugging

> Status: outline.

## Built-in error types

| Type              | When it fires                                      |
| ----------------- | -------------------------------------------------- |
| `Error`           | Base class. Use for domain errors.                 |
| `TypeError`       | Wrong type — the classic `Cannot read property`.   |
| `RangeError`      | Number out of range (e.g. `new Array(-1)`).        |
| `SyntaxError`     | `JSON.parse` failure, `eval` bad input.            |
| `ReferenceError`  | Reading an undeclared name.                        |
| `AggregateError`  | `Promise.any` when every promise rejects.          |

## Custom errors

```js
class AppError extends Error {
  constructor(message, { code, cause } = {}) {
    super(message, { cause })
    this.name = this.constructor.name
    this.code = code
  }
}

class NotFoundError extends AppError {}
class AuthError extends AppError {}
```

Rules:

- Extend from `Error` or a common `AppError` base.
- Set `this.name` — otherwise stack traces show `Error:`.
- Use the `cause` option (ES2022) — preserves the low-level trigger.

## Error boundaries

- **HTTP handler** — catch, log, respond with `{ error: { code, message } }`.
- **Node top-level** — `process.on('uncaughtException')` /
  `process.on('unhandledRejection')`. Log; crash if unrecoverable.
- **React** — Error Boundary components (or route-level in newer routers).

## Serialization

`JSON.stringify(new Error('x'))` returns `'{}'`. To serialize:

```js
function serializeError(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    cause: err.cause ? serializeError(err.cause) : undefined,
    ...err, // any custom fields
  }
}
```

## Debugging techniques

- `console.log` — the classic. Also `console.table`, `console.dir({depth: null})`.
- `debugger` — pause execution when DevTools / Node inspector is attached.
- **Conditional breakpoints** — pause only when a condition is true.
- **Logpoints** — like `console.log` but without editing the code.
- `node --inspect-brk file.js` — pause at start, connect Chrome/VS Code.

## Common bugs and their smells

- **`Cannot read property 'x' of undefined`** — a defensive read (`?.`)
  is missing.
- **Silent failure** — `.catch(() => {})` in the middle of a chain.
- **Zombie async** — a fetch that never resolves. Missing timeout.
- **Promise inside a `map` without `Promise.all`** — the map returns
  `Array<Promise>`, not `Array<T>`.

## Common Interview Questions

1. Explain the `cause` option on `Error`.
2. How would you distinguish a 404 from a 500 in your service?
3. How do you catch errors thrown in a promise chain vs an `await`?
4. What happens on `throw` inside a `finally`?
5. What is an unhandled rejection?
