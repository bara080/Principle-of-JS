# Concepts — Fundamentals

Deep explanations for every concept in this module. Skim on first read; come
back when a specific exercise trips you up.

Every section follows the same shape:

1. **Concept** — what it is.
2. **Why it matters in production** — what breaks without it.
3. **Practical example** — how it appears in real code.
4. **Common mistake** — the bug engineers actually ship.
5. **Exercise** — a small self-check.
6. **Expected result** — how to know you got it.

---

## 1. Variables — `const`, `let`, and why `var` is gone

**Concept.** JavaScript has three declarations. `const` binds a name to a
value; you cannot rebind. `let` binds a name and you can rebind. `var` is the
legacy declaration — function-scoped, hoisted, redeclarable.

**Why it matters in production.** Every `let` you write is a mutation surface —
future readers must scan the function to know its current value. `const`
narrows the search space to "this value, always." `var` allows redeclaration,
which silently swallows typos and lets loop iteration variables leak into
callbacks in ways that ruin async code.

**Practical example.**

```js
// Good — const by default, let when reassignment is the point.
const MAX_RETRIES = 3
const users = await fetchUsers()

let successful = 0
for (const user of users) {
  if (await sync(user)) successful++
}
```

**Common mistake.** Using `var` inside a loop where the closure captures the
final value:

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)
// logs: 3, 3, 3  — `var i` is one shared binding
```

Fix: `let i`. Each iteration gets a fresh binding, logs `0, 1, 2`.

**Exercise.** Predict the output of the loop above with `let` instead of `var`.

**Expected result.** `0`, `1`, `2` — because `let` creates a new binding per
iteration and each `setTimeout` closes over its own `i`.

---

## 2. Primitive types

**Concept.** Seven primitives — `string`, `number`, `boolean`, `null`,
`undefined`, `bigint`, `symbol` — plus `object`. Primitives are immutable and
compared by value; objects are compared by reference.

**Why it matters in production.** Type errors are the #1 category of runtime
JS bugs. Knowing which value is a primitive tells you (a) whether `===` will
do what you want, (b) whether mutating a variable leaks to callers, (c)
whether the value survives JSON round-tripping.

**Practical example.**

```js
const cents = 1999n         // BigInt — safe for exact integer money over 2^53
const id = Symbol('userId') // unique key, won't collide in a Map
const missing = null        // intentional "no value"
let unset                   // undefined — variable declared but not assigned
```

**Common mistake.** Treating `undefined` and `null` interchangeably in APIs.
`JSON.stringify({ a: undefined })` produces `'{}'` — the key vanishes.
`JSON.stringify({ a: null })` preserves the key. Pick one shape and document it.

**Exercise.** Given `const x = { name: 'Ada', age: undefined }`, what does
`JSON.stringify(x)` produce? What about `JSON.stringify({ ...x, age: null })`?

**Expected result.** `'{"name":"Ada"}'` then `'{"name":"Ada","age":null}'`.

---

## 3. Type conversion and coercion

**Concept.** JS coerces types in three flavors: **string context** (`+` when
either side is a string, template literals), **number context** (`-`, `*`,
`/`, `<`, `>`, `Number()`), and **boolean context** (`if`, `!`, `&&`, `||`).
Coercion follows a set of rules — small enough to memorize, weird enough to
bite you if you don't.

**Why it matters in production.** Prices from the DOM are strings.
`req.query.limit` is a string. `localStorage.getItem` returns a string. Every
input into your program is a string until you coerce it. Coerce **at the
boundary** — the moment the value enters your code — and use typed values
everywhere else.

**Practical example.**

```js
// At the boundary — Express query params are strings.
function parsePagination(query) {
  const page = Number.parseInt(query.page, 10)
  const limit = Number.parseInt(query.limit, 10)
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20,
  }
}
```

**Common mistake.** `Number('')` is `0`. `Number(' ')` is `0`. `Number(null)`
is `0`. `Number(undefined)` is `NaN`. The `+` prefix (`+value`) is even more
lenient. Always use `Number.parseInt(v, 10)` or `Number.parseFloat(v)`, then
validate with `Number.isFinite`.

**Exercise.** What is `Number('12px')`? What is `Number.parseInt('12px', 10)`?

**Expected result.** `NaN`, then `12`. `parseInt` reads leading digits;
`Number` requires the entire string to be a valid number.

---

## 4. Equality — `===` vs `==` vs `Object.is`

**Concept.** `===` returns `true` only when types and values match (with two
exceptions: `NaN === NaN` is `false`, and `+0 === -0` is `true`). `==`
performs coercion first. `Object.is(a, b)` matches `===` except it treats
`NaN` as equal to itself and `+0` as different from `-0`.

**Why it matters in production.** Role checks (`user.role === 'admin'`),
feature flags, cache-key comparisons — anywhere a wrong equality returns
`true` is a security or correctness bug. `==` is banned by most linters.

**Practical example.**

```js
if (paymentStatus === 'succeeded') fulfillOrder(order)
if (Number.isNaN(score)) score = 0   // Object.is(score, NaN) also works
```

**Common mistake.**

```js
if (user.role == 'admin') { ... }
// If user.role is undefined, this is false — fine.
// But 0 == '' is true, [] == false is true, [] == ![] is TRUE. Never use ==.
```

**Exercise.** Which of these are `true` under `==`?
`0 == ''`, `0 == '0'`, `'' == '0'`, `null == undefined`, `null == false`.

**Expected result.** `true`, `true`, `false`, `true`, `false`. (Yes, seriously.)

---

## 5. Operators — nullish coalescing `??` and optional chaining `?.`

**Concept.** `a ?? b` returns `a` unless `a` is `null` or `undefined`, in
which case `b`. `a?.b` returns `undefined` if `a` is `null`/`undefined`,
otherwise `a.b`. `a?.()` short-circuits if `a` is nullish.

**Why it matters in production.** Reading nested data from an API response,
applying defaults for optional config, invoking a possibly-absent callback.
These operators eliminate 90% of `Cannot read property 'x' of undefined`.

**Practical example.**

```js
const port = Number(process.env.PORT) || 3000        // ⚠️ 0 becomes 3000
const port2 = Number(process.env.PORT) ?? 3000       // 0 stays 0

const city = order.shipping?.address?.city ?? 'N/A'
onUploadComplete?.(file)                              // call if defined
```

**Common mistake.** Reflexively reaching for `||` to apply a default. If the
value can legitimately be `0`, `''`, or `false`, `||` overrides it. Use `??`
for "the value is missing" and `||` for "the value is falsy on purpose."

**Exercise.** A user sets their notification volume to `0`. Which produces the
right stored value: `config.volume || 50` or `config.volume ?? 50`?

**Expected result.** `??` — `0` is a valid volume; `||` would silently reset it to 50.

---

## 6. Control flow — `if`/`else`, `switch`, ternary, guard clauses

**Concept.** Branch execution based on a condition. Guard clauses return early
on an invalid or exceptional case, keeping the happy path un-nested.

**Why it matters in production.** Deep nesting (`if inside if inside if`) is
where bugs hide. Guard clauses flatten logic and make the invariant at each
line obvious. Reviewers can scan a well-guarded function in seconds.

**Practical example.**

```js
function refund(order, user) {
  if (!user.can('refund')) return { ok: false, reason: 'forbidden' }
  if (order.status !== 'paid') return { ok: false, reason: 'not-paid' }
  if (order.refundedAt) return { ok: false, reason: 'already-refunded' }

  // Happy path — no nesting.
  return { ok: true, data: performRefund(order) }
}
```

**Common mistake.** Long `switch` blocks without `break` — accidental
fall-through. Prefer a lookup table (`Map` or object) for
`status → handler` mappings, or use `switch (true)` with typed narrow cases.

**Exercise.** Refactor a nested `if/else` chain (in exercise #6 of
`exercises.js`) into guard clauses.

**Expected result.** Fewer levels of indentation, and each exit point is a
single line at the top of the function.

---

## 7. Loops — the right tool for the job

**Concept.** JS has too many loops. Pick by intent:

| Use              | Loop                                            |
| ---------------- | ----------------------------------------------- |
| Transform array  | `array.map`                                     |
| Filter array     | `array.filter`                                  |
| Reduce to value  | `array.reduce`                                  |
| Side effect      | `for (const item of array)`                     |
| Need index       | `for (const [i, item] of array.entries())`      |
| Unknown length   | `while (condition)`                             |
| Await in sequence | `for (const item of array)` with `await`       |
| Await in parallel | `Promise.all(array.map(fn))`                   |

**Why it matters in production.** `array.map` returning a value is a promise
you're transforming; `forEach` returning `undefined` is a promise you're
mutating something. Reviewers rely on the loop choice to signal intent.

**Practical example.**

```js
const totals = orders.map(o => o.subtotal + o.tax)    // pure transform
const paid = orders.filter(o => o.status === 'paid')  // subset
const revenue = orders.reduce((sum, o) => sum + o.total, 0)  // aggregate
```

**Common mistake.** Using `for...in` on arrays. `for...in` walks *enumerable
keys of any type*, including inherited ones from `Array.prototype`
extensions — you can end up iterating `"length"` or `"forEach"` in older
polyfilled environments. `for...of` iterates *values*; `for (let i...)`
iterates indices as numbers.

**Exercise.** Sum the `price` of every product in `items` two ways: once with
`for...of`, once with `reduce`.

**Expected result.** Both return the same number. `reduce` is one line, but
it's opaque to readers who haven't seen it — pick the one that reads clearer
in context.

---

## 8. Scope — lexical, block, function, global

**Concept.** A variable is visible in the block (or function) that declares
it, plus every nested block. This is decided at *parse time*, not runtime —
that's what "lexical" means.

**Why it matters in production.** Closures work because of lexical scope. If
you can't predict what variables a function can see, you can't reason about
what it does. Async code, event handlers, and React hooks all depend on
closure — and closure depends on scope.

**Practical example.**

```js
function makeCounter() {
  let count = 0                    // captured by closure
  return {
    increment: () => ++count,      // shares access to `count`
    reset: () => { count = 0 },
    read: () => count,
  }
}
```

**Common mistake.** Assuming inner functions get a snapshot of outer
variables. They don't — they get a **live reference**. Mutating `count`
after `increment` is created still affects future calls.

**Exercise.** Write `makeCounter` above from scratch. Then explain why
returning `{ count }` (not `{ read: () => count }`) breaks the pattern.

**Expected result.** `{ count }` returns the *current* value once. The
outside world holds a number, not a reference — mutations inside never leak
out. That's precisely why the accessor pattern (`read: () => count`) exists.

---

## Common Interview Questions

1. **What's the difference between `null` and `undefined`?**
   `undefined` means "not set." `null` means "explicitly no value." Only `null`
   is intentional; only `undefined` is the default.

2. **Explain `==` vs `===`.**
   `==` coerces types before comparing; `===` doesn't. Coercion rules are
   surprising enough that most style guides ban `==`. Only common exception:
   `x == null` as a shorthand for `x === null || x === undefined`.

3. **Why is `typeof null === 'object'`?**
   Historical bug in the first JS implementation. It's specified now, and can't
   be fixed without breaking the web. Use `value === null` to test.

4. **What is hoisting?**
   Function declarations are moved to the top of their scope; `var`
   declarations are hoisted with initial value `undefined`; `let`/`const` are
   hoisted but stay in a "temporal dead zone" until the declaration line.

5. **What does `NaN === NaN` return?** `false`. Use `Number.isNaN(x)`.

6. **`0.1 + 0.2 === 0.3`?** `false`. Floating-point representation. Use
   integers (cents) for money.

7. **When would you choose `??` over `||`?**
   When `0`, `''`, or `false` are valid values you don't want to override.

## Common Bugs

- **Silent NaN.** `Number(undefined)` is `NaN`, and `NaN` propagates through
  arithmetic. Guard with `Number.isFinite`.
- **Off-by-one in for loops.** `<=` vs `<`. Prefer `for...of` or array methods.
- **Mutation-through-alias.** `const b = a; b.foo = 1` mutates `a` too if `a`
  is an object. Use `{ ...a }` to snapshot.
- **Truthy check on `0` or `''`.** `if (count) { ... }` skips zero — a valid
  count. Use `if (count != null)` or explicit comparisons.
- **`for...in` on arrays** — see section 7.
- **Reassigning `const` object contents** works — `const` prevents rebinding,
  not mutation. Use `Object.freeze` if you need immutability.

## Performance Considerations

- Array methods (`map`/`filter`/`reduce`) create new arrays. In hot loops
  processing millions of items, a plain `for` loop is measurably faster.
  In application code, prefer the readable version.
- Nested `array.find` inside `array.map` is O(n²). Build a `Map` first if the
  same lookup runs repeatedly.
- Coercing in a loop is wasteful. Coerce once at the entry point.

## Security Considerations

- **Never trust input.** Anything from `req`, `process.env`, `localStorage`,
  the DOM, or a fetch response is untrusted. Validate shape and range before
  using it in a decision, a query, or a template.
- **Prototype pollution.** Don't blindly merge untrusted objects into your
  own with `Object.assign` or `...spread` — an attacker can set `__proto__`.
  Whitelist keys.
- **Log carefully.** Coercing a user-controlled object to a string via
  `` `${x}` `` invokes `toString`, which can be attacker-controlled.
- **Never `eval`.** Never `new Function` on user input. There is no safe way.
