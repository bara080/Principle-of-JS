# Closures

## Common questions

**1. What is a closure?**
A function that retains access to variables from its lexically enclosing scope,
even after that scope has returned.

**2. Real use?**
Private state (`makeCounter`), memoization caches, React hooks.

**3. The `var` loop trap.**

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))
// 3, 3, 3 — one shared `i`
```

Fix: `let i`. Each iteration gets a fresh binding.

**4. What does IIFE mean? Why does it exist?**
Immediately-Invoked Function Expression. Historical way to create a scope
before `let`/`const`/modules.

**5. Memoize a function.**

```js
const memo = (fn) => {
  const cache = new Map()
  return (arg) => cache.get(arg) ?? cache.set(arg, fn(arg)).get(arg)
}
```

## Common mistakes

- Confusing "closure" with "the function itself" — closure is the *combination*
  of function + captured environment.
- Believing closures snapshot values. They hold *references*.

## Senior-level nuances

- Closures pin memory. A closure over a huge object keeps it alive until
  the closure is unreachable. Common cause of memory leaks in SPAs.
- **Module closure** — code inside an ES module runs once; top-level `let`
  is effectively a private singleton.
