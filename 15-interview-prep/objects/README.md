# Objects, Prototypes, `this`

## Common questions

**1. Explain `this`.**
Determined at the call site, not the definition. `obj.fn()` → `obj`. `fn()` →
`undefined` (strict) / global (sloppy). `new Cls()` → new instance. `.call(x)` /
`.apply(x)` / `.bind(x)` → `x`. Arrow functions inherit `this` from lexical scope.

**2. Prototype chain?**
Every object has an internal `[[Prototype]]`. Lookups walk the chain until
they find the key or hit `null`.

**3. `class` vs prototype-based inheritance?**
`class` is syntax sugar for prototype chains — mostly. Private fields (`#`)
are truly private and can't be polyfilled.

**4. `Object.create(null)` vs `{}`?**
The former has no prototype — no `toString`, `hasOwnProperty`, or `__proto__`.
Safer as a dictionary against prototype pollution.

**5. What is prototype pollution?**
Attacker sets `__proto__` on a JSON payload; a naive deep-merge into your
config assigns to `Object.prototype`. Now every object in the process has
new properties. Fix: use `Object.create(null)`, whitelist keys, or a proper
deep-merge library.

## Whiteboard exercises

Implement `bind`, `call`, `apply` from scratch.

## Common mistakes

- Answering "prototype chain" as if it were "class hierarchy."
- Missing that arrow functions have no `this` of their own.
- Not knowing `#field` is real privacy (not just naming convention).

## Senior-level nuances

- `class X extends Y` sets `X.prototype.__proto__ = Y.prototype` **and** `X.__proto__ = Y`.
  That second line is why static methods inherit too.
- `super.method()` is bound to the prototype at define time, not call time.
- `WeakRef` and `FinalizationRegistry` — rarely needed, but interviewers
  love them.
