# Cheatsheet — Fundamentals

Terse. Keep it open while you code.

## Variables

```js
const PI = 3.14           // default
let count = 0             // only when you'll reassign
// var                    // ❌ never in new code
```

Rule: `const` first. Convert to `let` only when a reassignment forces it.

## Primitives

```text
string  number  boolean  null  undefined  bigint  symbol
```

Everything else is `object` (arrays and functions included).

## Type checks

```js
typeof x                       // 'string' | 'number' | 'boolean' | 'undefined' | 'bigint' | 'symbol' | 'object' | 'function'
Array.isArray(x)               // arrays
x === null                     // ⚠️  typeof null === 'object'
Number.isFinite(x)             // rejects NaN, Infinity, non-numbers
Number.isInteger(x)            // integers only
Number.isNaN(x)                // safe NaN test
```

## Coercion — the boundary rules

```js
Number('')          // 0    😱
Number(' ')         // 0    😱
Number(null)        // 0    😱
Number(undefined)   // NaN
Number('12px')      // NaN
Number.parseInt('12px', 10)   // 12
Number.parseFloat('3.14em')   // 3.14
```

**Never** call `parseInt` without the radix.

## Equality

```js
a === b                 // default
a == null               // ✅ shorthand for a === null || a === undefined
a == b                  // ❌ everywhere else
Number.isNaN(x)         // ✅ NaN test
Object.is(a, b)         // rarely — treats NaN as equal, +0 ≠ -0
```

## Modern operators

```js
a ?? b                  // b only when a is null/undefined
a || b                  // b when a is 0, '', false, null, undefined, NaN
a?.b?.c                 // undefined if any step is nullish
a?.()                   // safe call
a?.[key]                // safe index

const { x = 1, y: renamed = 2 } = obj
const [first, ...rest] = arr
const merged = { ...a, ...b }
```

## Control flow

```js
// Guard clauses > nested ifs
if (!user) return null
if (!user.active) return null
doWork(user)

// Ternary — for values, not statements.
const label = count === 1 ? 'item' : 'items'

// switch — always break, or use return.
switch (status) {
  case 'paid': return handlePaid()
  case 'refunded': return handleRefunded()
  default: throw new Error(`unknown status: ${status}`)
}

// Lookup table — often cleaner than switch.
const handlers = {
  paid: handlePaid,
  refunded: handleRefunded,
}
handlers[status]?.() ?? unknownStatus(status)
```

## Loops — pick by intent

```js
arr.map(fn)                                // transform
arr.filter(fn)                             // subset
arr.reduce((acc, x) => ..., init)          // aggregate

for (const item of arr) sideEffect(item)   // iterate values
for (const [i, item] of arr.entries()) ... // + index
for (let i = 0; i < arr.length; i++) ...   // classic
while (condition) ...                      // unknown length

// Async in sequence:
for (const item of arr) await work(item)

// Async in parallel:
await Promise.all(arr.map(work))
```

Never `for...in` on arrays. `for...in` is for object keys (rare).

## Scope

- **Block scope** — `let` / `const` live inside `{ }`.
- **Function scope** — `var` lives inside `function`. (Don't use.)
- **Lexical scope** — a function sees names from where it was *defined*, not called.
- **Closure** — inner function keeps outer bindings alive.

```js
function makeCounter() {
  let count = 0
  return () => ++count
}
```

## Money — never use floats

```js
0.1 + 0.2 === 0.3            // false 😱
```

Store cents as integers. Convert only for display.

```js
const toCents = (usd) => Math.round(usd * 100)
const toDollars = (cents) => (cents / 100).toFixed(2)
```

## Defensive input

```js
function fn(input) {
  if (input === null || input === undefined) return { ok: false, error: 'missing' }
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (!name) return { ok: false, error: 'name required' }
  return { ok: true, data: { name } }
}
```

Rules:

1. Return errors as data; never throw on user input.
2. Coerce at the entry point; use typed values everywhere after.
3. Whitelist, don't blacklist. `'active' | 'inactive'`, not `!== 'banned'`.

## Common pitfalls — the whole file in one screen

```js
// 1. typeof null === 'object'.  Test: x === null.
// 2. NaN !== NaN.               Test: Number.isNaN(x).
// 3. 0.1 + 0.2 !== 0.3.         Use integer cents.
// 4. Number('') === 0.          Coerce with parseInt + Number.isFinite.
// 5. `??` respects 0, ''.       Prefer over `||` for defaults.
// 6. const prevents rebinding, not mutation.
// 7. sort() mutates.            Use [...arr].sort() to snapshot.
// 8. JSON drops undefined.      Use null for "explicit no value".
// 9. for...in walks inherited keys.  Use for...of for arrays.
// 10. Function parameters share references.  Spread to copy.
```

## Interview tips

- **"What's the difference between `null` and `undefined`?"** — undefined is the
  language default; null is intentional. Only null is set on purpose.
- **"When would you use `==`?"** — Only `x == null` as a shorthand for both
  null and undefined. Otherwise never.
- **"Explain hoisting."** — Function declarations lift fully. `var` lifts as
  undefined. `let`/`const` lift but are in the temporal dead zone until the
  declaration line runs.
- **"Why avoid `var`?"** — Function-scoped, redeclarable, hoisted with
  undefined. Every one of those is a bug source.
- **"What's the output of `0.1 + 0.2`?"** — 0.30000000000000004. Follow up
  with how you'd handle money.

## Useful built-ins

| Built-in                        | For                                    |
| ------------------------------- | -------------------------------------- |
| `Number.isFinite(x)`            | Validating numbers                     |
| `Number.parseInt(s, 10)`        | Integer parsing with base              |
| `Number.parseFloat(s)`          | Float parsing                          |
| `Array.isArray(x)`              | Array check                            |
| `Object.entries(obj)`           | Iterate `[key, value]` pairs           |
| `Object.fromEntries(pairs)`     | Rebuild an object                      |
| `Object.freeze(obj)`            | Shallow immutability                   |
| `Object.hasOwn(obj, key)`       | Own-key check (safer than `in`)        |
| `Map`, `Set`                    | Keyed / unique collections             |
| `Intl.NumberFormat(...)`        | Localized number and currency display  |
