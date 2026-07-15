# Mini-Project — LRU Cache

Build a Least-Recently-Used cache. Backed by `Map` (which preserves insertion
order in modern JS). Supports `get`, `set`, `has`, `delete`, `size`, `clear`,
and eviction when `max` is exceeded.

## Files

```text
mini-project/
├── README.md
├── index.js         — LRU class
└── index.test.js    — tests including eviction order
```

## Requirements

- `new LRU(max)` — throws `TypeError` on non-positive `max`.
- `get(k)` — returns value; refreshes key's recency; returns `undefined` on miss.
- `set(k, v)` — inserts / updates; evicts the least-recently-used entry when full.
- `has(k)` — does NOT refresh recency.
- `delete(k)` — returns boolean.
- `size` — current entry count.
- `clear()` — empties the cache.
- Iterable — `for (const [k, v] of lru)` yields most-recent first.

## Run

```bash
node --test 04-arrays-strings-data-structures/mini-project/index.test.js
```
