// Module 08 — exercises
// Run: node 08-error-handling-debugging/exercises.js
//
// 1. ApiError + getJSON
//    Classify failure as network / http / parse. (Also exercise 6 in practice/.)
//    err.kind // 'http'
//
// 2. assertNever
//    A function that throws on any value — used to prove a switch is exhaustive.
//    default: assertNever(kind)
//
// 3. retryOn
//    Retry only on 5xx and network errors. Never retry a 404 — it will never succeed.
//    retryOn(fn, isRetryable)
//
// Implement below. Delete the throw as you go.

const TODO = name => { throw new Error(`${name}: not implemented`) }

void TODO
