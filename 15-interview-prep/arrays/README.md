# Arrays

Practice the top-N array problems on `node --test`.

## Common questions

**1. Deduplicate an array preserving order.**
`[...new Set(arr)]`.

**2. Flatten a nested array.**
`arr.flat(depth)`. For infinite depth: `arr.flat(Infinity)`.

**3. Rotate by k.**
`arr.slice(-k).concat(arr.slice(0, -k))`. In-place with reversal trick if asked.

**4. Chunk into groups of n.**
```js
Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
```

**5. Group by key.**
`Object.groupBy(arr, (item) => item.key)` (Node 21+). Or a `reduce`.

**6. Merge two sorted arrays.**
Two pointers; O(n + m).

**7. Two-sum.**
`Map` from value → index; one pass.

**8. Sort by multiple keys.**
Chain comparators: `(a, b) => a.age - b.age || a.name.localeCompare(b.name)`.

## Whiteboard exercises

See [`exercises.js`](./exercises.js) — stubs with tests.

## Common mistakes

- `arr.sort()` on numbers without a comparator → lex sort.
- Nested `.find` inside `.map` → O(n²). Preprocess to a `Map`.
- Mutating with `.splice` when `.toSpliced` (ES2023) is safer.

## Senior-level nuances

- `sort` is stable in modern engines.
- `Array.prototype.at(-1)` reads the last element.
- `flatMap` = map + flat(1) in one pass. Idiomatic for one-to-many transforms.
