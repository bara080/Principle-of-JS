# Cheatsheet — Arrays, Strings, Data Structures

## Create

```js
Array.from({ length: 5 }, (_, i) => i * 2)  // [0, 2, 4, 6, 8]
Array.of(1, 2, 3)                            // [1, 2, 3]
[...'abc']                                   // ['a', 'b', 'c']
new Set([1, 1, 2])                           // Set { 1, 2 }
new Map([[1, 'a'], [2, 'b']])                // Map { 1 => 'a', 2 => 'b' }
```

## Transform / filter / aggregate

```js
arr.map(x => x * 2)
arr.filter(x => x > 0)
arr.reduce((sum, x) => sum + x, 0)
arr.flatMap(x => [x, x])          // both flatten and map
arr.find(x => x.id === id)
arr.some(x => x.active)
arr.every(x => x.valid)
```

## Immutable variants (ES2023+)

```js
arr.toSorted((a, b) => a - b)
arr.toReversed()
arr.toSpliced(i, 1)
arr.with(i, newValue)
```

## Strings

```js
str.slice(1, -1)
str.replaceAll('foo', 'bar')
str.split(/\s+/)
str.padStart(3, '0')                // '007'
str.at(-1)                           // last char
`${name}, age ${age}`                // template literal
```

## Sets & Maps

```js
const seen = new Set()
if (seen.has(id)) return
seen.add(id)

const counts = new Map()
counts.set(k, (counts.get(k) ?? 0) + 1)
```

## Common patterns

```js
// Deduplicate preserving order
[...new Set(arr)]

// Group by key
arr.reduce((acc, item) => {
  ;(acc[item.key] ??= []).push(item)
  return acc
}, {})

// Chunk
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  )
```

## LRU with Map (relies on insertion-order iteration)

```js
class LRU {
  #max
  #map = new Map()
  constructor(max) { this.#max = max }
  get(k) {
    if (!this.#map.has(k)) return undefined
    const v = this.#map.get(k)
    this.#map.delete(k)
    this.#map.set(k, v)
    return v
  }
  set(k, v) {
    if (this.#map.has(k)) this.#map.delete(k)
    this.#map.set(k, v)
    if (this.#map.size > this.#max) this.#map.delete(this.#map.keys().next().value)
  }
}
```

## Interview tips

- Always ask if input is sorted before proposing binary search.
- If a nested loop looks unavoidable, ask if you can preprocess into a `Map`.
- `arr.sort()` is stable in modern engines (V8, Safari, Firefox all ≥ 2019).
