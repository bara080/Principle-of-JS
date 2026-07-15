# Module 08 — Error Handling & Debugging

> Errors are data. Debugging is a skill. Both are underrated.

## Learning Objectives

- Distinguish `Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`.
- Design a custom error hierarchy for your domain.
- Use `cause` to chain low-level errors into meaningful ones.
- Catch errors in promises and `async` code without swallowing them.
- Debug with `console` methods, `debugger`, DevTools breakpoints, and source maps.
- Handle uncaught errors and unhandled rejections in Node.

## Why This Topic Matters

Bad error handling produces bugs that look like other bugs — a promise
rejection eaten silently becomes "the button doesn't do anything." A production
service that logs `Error: undefined` at midnight has no useful signal. Well-typed
errors and structured logging turn incidents into ~15-minute investigations.

## Where It Is Used In Production

- Every HTTP handler needs a well-defined error contract.
- Every service call is an opportunity for a chained error.
- Every third-party library boundary is a place errors need translation.

## Prerequisites

Modules 01–06.

## Skills Gained

- Reading a stack trace and finding the actual bug in 30 seconds.
- Writing errors that survive JSON.stringify (they don't by default).
- Choosing between throwing, returning `{ ok, err }`, and logging + swallowing.

## Estimated Completion Time

- Reading: 60 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. `throw 'a string'` — no stack trace.
2. `catch (err) { console.log(err) }` — lost. Rethrow or convert to a value.
3. Swallowing `err` from an inner `await` without a `try`/`catch`.
4. Using `Error` as your only class — no way to distinguish 404 from 500.
5. `JSON.stringify(err)` — returns `'{}'`. Use a serializer that copies `name`,
   `message`, `stack`, `cause`.

## Best Practices

- One error class per HTTP status code family (`NotFoundError`, `AuthError`,
  `ConflictError`).
- Wrap third-party errors with `new AppError('...', { cause: err })`.
- Return errors as data on the happy path if the caller can meaningfully handle
  them; throw for programmer errors.
- Log with structured fields (JSON), not concatenated strings.

## Mini-Project Overview

**`mini-project/`** — a Result type (`ok`/`err` sum type) and a small error
hierarchy. Fluent chaining, type guards, JSON-serialization-safe errors.

## Recommended Resources

- Node.js docs — `process.on('unhandledRejection')`.
- Chrome DevTools — Sources panel, conditional breakpoints, logpoints.
- Sentry blog — production error handling patterns.
