# Language

Fundamentals-round questions. Half of every junior/mid JS interview is here.

## Common questions

**1. `var` vs `let` vs `const`?**
`var` is function-scoped and hoisted with `undefined`; `let`/`const` are block-
scoped and stay in the temporal dead zone until their declaration line. `const`
prevents rebinding (not deep immutability).

**2. `==` vs `===`?**
`==` performs type coercion; `===` doesn't. Use `===` everywhere; `x == null`
is the only accepted `==` for "null or undefined".

**3. Explain hoisting.**
Function declarations lift fully. `var` lifts as `undefined`. `let`/`const`
lift into the TDZ.

**4. What is coercion? Give an example.**
Automatic type conversion. `'5' + 1 === '51'` (string). `'5' - 1 === 4` (number).
`+` is asymmetric.

**5. `null` vs `undefined`?**
`undefined` is the default; `null` is intentional.

**6. Why is `typeof null === 'object'`?**
Historical bug in the first JS implementation; can't be fixed without breaking
the web.

**7. `0.1 + 0.2 === 0.3`?**
`false`. IEEE-754 float. Use integer cents for money.

**8. What is a symbol?**
A unique primitive used as an object key; can't be discovered enumeratively.

## Whiteboard exercises

See [`exercises.js`](./exercises.js).

## Common mistakes

- Answering "hoisting" without mentioning the TDZ.
- Claiming `null === undefined` in loose equality (they are, but only via `==`).
- Missing that `Number('')` is `0`.

## Senior-level nuances

- **Optional chaining short-circuits.** `a?.b()` — if `a` is nullish, `.b()`
  is never evaluated. Not just `undefined` — actually skipped.
- **`??` and `||` have different fallthrough sets.** `??` = `null | undefined`;
  `||` = falsy.
- **`Object.is` is not `===`.** `Object.is(NaN, NaN) === true`; `Object.is(+0, -0) === false`.
