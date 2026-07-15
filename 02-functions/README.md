# Module 02 — Functions Deep Dive

> Functions are the primary tool for organizing code. Getting `this`, closures,
> and higher-order patterns right is what separates junior JS from senior JS.

## Learning Objectives

- Choose declaration, expression, or arrow function — and know when each matters.
- Predict `this` at any call site without running the code.
- Use closures for private state, memoization, and event handlers.
- Write higher-order utilities: `debounce`, `throttle`, `memoize`, `pipe`.
- Understand hoisting for both declarations and `var`/`let`/`const`.
- Use generators for lazy sequences and cooperative iteration.

## Why This Topic Matters

Functions are the unit of composition in JS. Every framework — React,
Express, RxJS — is a set of higher-order function conventions. If you can't
predict what `this` refers to in a callback, you can't debug the framework
you're using. If you don't understand closures, hooks look magical.

## Where It Is Used In Production

- **React hooks** — every hook is a closure over the component's state cell.
- **Express middleware** — `(req, res, next) => …` is HOF composition.
- **Redux reducers** — pure functions over state.
- **RxJS operators** — pipelines of higher-order functions.
- **Debounced search inputs**, throttled scroll handlers.
- **Test spies** — functions that record how they were called.

## Prerequisites

Module 01 (fundamentals).

## Skills Gained

- Comfort reading unfamiliar callback-heavy code (Express, event emitters).
- Ability to write utilities that transform other functions.
- Ability to explain `this`, `bind`, `call`, `apply` without hedging.

## Estimated Completion Time

- **Reading:** 90 minutes.
- **Exercises:** 3 hours.
- **Mini-project:** 2 hours.

## Common Mistakes

1. Arrow functions inside class methods — losing access to `this`.
2. Reassigning `this` in a callback with `const self = this` when `.bind(this)` or an arrow would work.
3. Using `Function.prototype.bind` in a `render` — it creates a new function every render.
4. Memoizing a function that has non-primitive args by reference — cache never hits.
5. Debounce with a shared timer across users.

## Best Practices

- Default to arrow functions for inline callbacks.
- Use named function declarations for anything called by name later — stack
  traces improve dramatically.
- Prefer explicit parameters over `arguments`.
- Keep functions small enough to hold in your head — ~20 lines is a good ceiling.

## Mini-Project Overview

**`mini-project/`** — a functional-programming toolkit: `debounce`, `throttle`,
`memoize`, `once`, `pipe`, and `compose`. Each with a real production use case
in its docstring, and comprehensive tests.

## Recommended Resources

- MDN — Functions: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
- Kyle Simpson — *You Don't Know JS Yet: Scope & Closures*
- `github.com/lodash/lodash` — read the source of `debounce` and `throttle`.
