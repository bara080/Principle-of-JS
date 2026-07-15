# Module 01 — Fundamentals

> The base layer. Every module after this assumes you can read and reason about
> the code in `lesson.js` without help. Get this one solid.

## Learning Objectives

By the end of this module you can:

- Choose the correct variable declaration (`const`, `let`, never `var`) and explain why.
- Name every primitive type and predict the result of coercions between them.
- Read `===`, `??`, `?.`, and short-circuiting expressions the way a compiler does.
- Pick the right loop or array method for a problem — and know when neither is right.
- Explain scope from lexical rules alone, without running the code.
- Validate user input defensively at a trust boundary.

## Why This Topic Matters

Every bug in later modules — race conditions, prototype-chain confusion, silent
`NaN` propagation, mutation-in-a-`useEffect` — has a fundamentals-shaped hole
under it. Weak fundamentals compound: closures are confusing if scope is
confusing; async is terrifying if you don't trust equality. Fixing this once
pays back for years.

## Where It Is Used In Production

| Concept              | Real production usage                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| `const` / `let`      | Every file. `const` for imports, config, computed values; `let` for accumulators. |
| Nullish coalescing   | Reading env vars: `const port = process.env.PORT ?? 3000`.                |
| Optional chaining    | Traversing API responses: `user?.address?.city`.                          |
| Strict equality      | Auth checks, feature flags, role comparisons.                             |
| `Number.isFinite`    | Validating money, quantities, coordinates — anywhere `NaN` corrupts data. |
| Ternary + guard clauses | Short branches inside JSX, request handlers, reducers.                 |
| `for...of` + `entries()` | Iterating arrays when you need both index and item.                   |
| Block scope          | Preventing accidental variable capture in `for` loops with async work.    |

## Prerequisites

- Node 20+ installed (`node --version`).
- Basic terminal usage (`cd`, `ls`, running `node file.js`).
- A code editor. VS Code + ESLint + Prettier is the default recommendation.

## Skills Gained

- Reading unfamiliar JS without pattern-matching to what you already know.
- Writing input validation you'd merge into a real service.
- Debugging by scope and type rather than by guessing.
- Recognizing the small handful of coercion rules that cause 90% of "weird JS" bugs.

## Estimated Completion Time

- **Reading:** 60–90 minutes (`concepts.md`, `lesson.js`, `examples.js`).
- **Exercises:** 2–3 hours across beginner → challenge tiers.
- **Mini-project:** 1.5–2 hours implementing + passing tests.

Budget one focused evening or two lunch breaks. Don't rush the mini-project —
that's where the module actually sticks.

## Common Mistakes

1. **`var` in modern code.** Function-scoped, hoisted, reassignable — three
   footguns for the price of one. `let`/`const` only.
2. **`==` "just to be safe."** Loose equality has 12 coercion rules. Nobody
   remembers all of them. Use `===` and coerce explicitly.
3. **Trusting `typeof null === 'object'`.** Historical bug baked into the spec.
   Test with `value === null` first.
4. **`NaN === NaN` returns `false`.** Use `Number.isNaN(x)`, not `x === NaN`.
5. **Floating-point equality.** `0.1 + 0.2 !== 0.3`. Use integer cents for
   money, and `Math.abs(a - b) < EPSILON` for comparisons.
6. **Mutating a caller's array/object.** `arr.sort()` mutates. `arr.slice().sort()` doesn't.
7. **Confusing `null` (intentional absence) with `undefined` (unset).** They
   have different meaning in APIs — pick one and be consistent.
8. **`??` vs `||`.** `||` treats `0`, `''`, and `false` as absent. `??` treats
   only `null`/`undefined` as absent. Wrong choice = wrong default.
9. **Reading `.length` on a possibly-missing array.** Guard with `?.length ?? 0`.
10. **Using `for...in` on arrays.** `for...in` iterates enumerable string keys —
    including inherited ones. Use `for...of` for values, `for (let i...)` for indices.

## Best Practices

- Default to `const`. Reach for `let` only when you know you'll reassign.
- Coerce at the boundary. Once inside your function, values should already be
  the right type — don't re-check them everywhere.
- Prefer named constants over magic numbers: `const MAX_ITEMS = 100`.
- Guard clauses over deep nesting: fail fast, return early.
- Never mix `??` and `||` in the same expression without parentheses — the
  parser will refuse anyway.
- Read the ECMAScript spec for anything genuinely surprising. It's shorter than
  people think for a single operator.

## Mini-Project Overview

**`mini-project/order-processor.js`** — a production-style order processor.

- Validates order shape (products, customer, permissions).
- Computes subtotal, tax, discount, and final total.
- Handles missing optional data (no discount code, no delivery instructions).
- Enforces role-based permissions (guest vs. customer vs. admin).
- Returns a structured `{ ok: true, data }` or `{ ok: false, errors }` result —
  never throws on user input.
- Ships with `node --test` unit tests covering the golden path and the edge cases.

You'll touch every concept in this module implementing it.

## Recommended Resources

- **MDN** — the reference. Start here for any built-in:
  <https://developer.mozilla.org/en-US/docs/Web/JavaScript>
- **ECMAScript spec** — authoritative but dense:
  <https://tc39.es/ecma262/>
- **Node.js docs** — for `node:` built-ins:
  <https://nodejs.org/api/>
- **You Don't Know JS Yet** (Kyle Simpson) — free online, deep dives into
  scope and coercion.
- **JavaScript.info** — modern tutorial, well-written examples.

## How To Work Through This Module

1. Read `README.md` (this file) — 5 min.
2. Read `concepts.md` — the mental model. 30–45 min.
3. Run `node 01-fundamentals/lesson.js` and read along. 20–30 min.
4. Skim `examples.js` for how the concepts show up in real code. 15 min.
5. Do `exercises.js` — tier by tier, no peeking. 2–3 hours.
6. Compare with `solutions.js` **only after** you've attempted each exercise.
7. Build the mini-project. Get the tests green.
8. Keep `cheatsheet.md` open as a lookup while working through later modules.
