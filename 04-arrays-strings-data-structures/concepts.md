# Concepts — Arrays, Strings, Data Structures

> Status: outline.

## Array methods — cheat by intent

| Intent            | Method                                  | Mutates? |
| ----------------- | --------------------------------------- | -------- |
| Transform         | `map`, `flatMap`                        | No       |
| Filter            | `filter`                                | No       |
| Aggregate         | `reduce`, `reduceRight`                 | No       |
| Find one          | `find`, `findIndex`, `findLast`         | No       |
| Test              | `some`, `every`, `includes`             | No       |
| Slice             | `slice`, `at`                           | No       |
| Concatenate       | `concat`, `[...a, ...b]`                | No       |
| Sort              | `toSorted` / `[...a].sort()`            | No / Yes |
| Reverse           | `toReversed`                            | No       |
| Fill/patch        | `fill`, `copyWithin`                    | Yes      |
| Push/pop/shift    | `push`, `pop`, `shift`, `unshift`       | Yes      |
| Splice            | `splice` / `toSpliced`                  | Yes / No |

The `to*` variants are the modern immutable counterparts (ES2023+).

## Strings — modern APIs

- `str.replaceAll(needle, replacement)` — no regex needed.
- `str.at(-1)` — negative indexing.
- `str.normalize()` — for Unicode-aware comparisons.
- Template literals with tagged functions for i18n / SQL safety.

## Map vs Object

| Feature              | Object    | Map          |
| -------------------- | --------- | ------------ |
| Arbitrary keys       | strings   | any type     |
| Insertion order      | ~preserved | guaranteed  |
| Size                 | Object.keys(o).length | `map.size` |
| Prototype pollution  | risk      | no risk      |
| Iterable             | `entries` | native       |

Rule: use `Map` for dictionaries with untrusted or non-string keys.

## Set — uniqueness and membership

- `set.has(x)` — O(1).
- `new Set(arr)` — deduplicate in one line.
- `[...new Set(arr)]` — array back out.

## Classic structures to implement from scratch

- **Stack** — array or linked-list backed. `push`/`pop`/`peek`.
- **Queue** — never use `arr.shift()` on hot paths (O(n)). Use two-stack queue
  or ring buffer.
- **Linked list** — `{ value, next }`.
- **Binary heap** — priority queue.
- **LRU cache** — `Map` + delete-and-reinsert.

## Time complexity to memorize

| Operation                           | Cost    |
| ----------------------------------- | ------- |
| `arr[i]`                            | O(1)    |
| `arr.push` / `arr.pop`              | O(1)    |
| `arr.unshift` / `arr.shift`         | O(n)    |
| `arr.includes` / `arr.indexOf`      | O(n)    |
| `set.has` / `map.get`               | O(1) avg |
| `arr.sort`                          | O(n log n) |

## Common Interview Questions

1. Implement an LRU cache.
2. Deduplicate an array preserving order.
3. Rotate an array by k without extra space.
4. Chunk an array into groups of n.
5. Flatten a nested array to depth d.
6. Sum every value in a nested object.
