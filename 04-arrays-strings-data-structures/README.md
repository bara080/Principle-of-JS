# Module 04 — Arrays, Strings & Data Structures

> Every application manipulates collections. Choose the right structure and
> the right method and code writes itself; choose wrong and every feature fights you.

## Learning Objectives

- Choose between array, `Map`, `Set`, and object as a keyed store.
- Read a `reduce` without slowing down.
- Distinguish mutating from non-mutating array methods.
- Manipulate strings with modern APIs — no regex needed for most cases.
- Implement classic data structures from scratch (stack, queue, linked list, heap).
- Reason about time complexity of common operations.

## Why This Topic Matters

Data processing is the workload of a backend and a UI. Every list of orders,
every table, every autocomplete is an array operation. Every cache is a `Map`.
Wrong data-structure choices show up as O(n²) hot paths.

## Where It Is Used In Production

- **Backend** — batching, aggregating, deduping DB results.
- **Frontend** — rendering lists, virtualized tables, autocomplete indexes.
- **Analytics** — reducers over event streams.
- **Real-time** — priority queues for scheduled jobs, LRU caches with `Map`.
- **Sort/search UI** — comparators and stable sorts.

## Prerequisites

Modules 01–03.

## Skills Gained

- Fluent transformations (`map` → `filter` → `reduce` chains) without intermediate loops.
- Building a small structure (LRU cache, ring buffer) from primitives.
- Big-O intuition — knowing when nested loops become a problem.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3–4 hr · Mini-project: 2 hr.

## Common Mistakes

1. `arr.sort()` mutating — copy first with `[...arr].sort()` if surprise-mutations are risky.
2. `sort()` without a comparator on numbers: `[10, 2].sort()` → `[10, 2]` (lex sort).
3. `for...in` on arrays (iterates keys as strings, including inherited).
4. Using arrays for uniqueness — `Set` is O(1) contains vs O(n).
5. Nested `array.find` inside `array.map` — O(n²). Build a `Map` first.
6. Using `Object` as a dictionary with arbitrary keys — `__proto__` risk. Use `Map`.

## Best Practices

- `Array.from({ length: n }, (_, i) => …)` for generating sequences.
- Prefer `Map` over object-as-dictionary for arbitrary keys.
- Use `Set` for uniqueness and membership tests.
- For huge streams, prefer a generator over building an intermediate array.

## Mini-Project Overview

**`mini-project/`** — an LRU cache implemented with `Map` (leveraging insertion
order). Fully tested including eviction, hit-ratio, and TTL behavior.

## Recommended Resources

- MDN — Array methods reference.
- MDN — Map, Set.
- *Introduction to Algorithms* (Cormen) — classic reference for data-structure Big-O.
