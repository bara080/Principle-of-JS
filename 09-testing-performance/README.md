# Module 09 — Testing & Performance

> Untested code is broken code. Slow code is unusable code. Both are fixable
> with a small set of habits.

## Learning Objectives

- Write unit tests with Node's built-in test runner (`node:test`).
- Structure test suites with `describe` / `test` and use `assert.strict`.
- Mock and spy on functions and modules.
- Test async code correctly.
- Measure performance with `performance.now`, marks, and measures.
- Debounce and throttle from scratch — and know which to reach for.
- Diagnose common memory leaks.

## Why This Topic Matters

Tests are the only sustainable way to keep changing code safely. Performance
work is 80% "don't repeat expensive work" and 20% micro-optimization. The
80% is trivial once you have profiling data.

## Where It Is Used In Production

- Every CI pipeline runs a test suite.
- Every user-facing input needs debouncing.
- Every scroll handler needs throttling (or `passive: true` at minimum).
- Every long list needs virtualization consideration.

## Prerequisites

Modules 01–08.

## Skills Gained

- Writing tests that survive refactors, don't over-mock, and read like docs.
- Diagnosing slow render loops with the Performance panel.
- Recognizing a leaking event listener before it hits prod.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. Testing implementation details — every refactor breaks the test.
2. Over-mocking — the tests pass but the integration is broken.
3. Debounce with a shared timer across users/components.
4. Throttle with `Date.now()` in a loop that never yields.
5. Measuring performance without a warm run (JIT hasn't kicked in).

## Best Practices

- Prefer `describe` per module, `test` per behavior.
- One assertion per test where reasonable — the failure name should say what broke.
- Fake timers for time-sensitive tests (Node has `mock.timers.enable()`).
- Prefer integration tests over unit tests for the happy path; unit-test edge cases.

## Mini-Project Overview

**`mini-project/`** — build `debounce`, `throttle`, and a small performance
harness (`bench(name, fn, iterations)`) with tests for correctness and timing.

## Recommended Resources

- Node docs — `node:test`, `node:assert/strict`.
- Chrome DevTools — Performance panel, Memory panel.
- Kent C. Dodds — *Common Testing Mistakes*.
