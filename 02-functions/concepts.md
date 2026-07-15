# Concepts — Functions Deep Dive

> Status: outline. Full content in a follow-up pass.

## 1. Function forms

- Declarations: `function name() {}` — hoisted.
- Expressions: `const fn = function name() {}` — not hoisted.
- Arrow: `const fn = () => {}` — no own `this`, `arguments`, or `super`.
- Method shorthand: `{ foo() {} }`.

## 2. Parameters

- Defaults: `function fn(x = 1)`.
- Rest: `function fn(...args)`.
- Destructured: `function fn({ id, name = 'anon' })`.
- Never use `arguments` in new code — use rest.

## 3. Hoisting

- Function declarations lift fully.
- `var` lifts as `undefined`.
- `let`/`const` lift but stay in the temporal dead zone.
- Arrow functions attached to `const` follow `const` semantics — they are
  not usable before their assignment line.

## 4. `this`

The value of `this` at a call site is decided by the call, not the definition:

| Call form                        | `this` is                                            |
| -------------------------------- | ---------------------------------------------------- |
| `obj.method()`                   | `obj`                                                |
| `fn()`                           | `undefined` in strict mode, global object otherwise  |
| `new Cls()`                      | The new instance                                     |
| `fn.call(x)` / `fn.apply(x, [])` | `x`                                                  |
| `fn.bind(x)()`                   | `x`                                                  |
| Arrow function                   | `this` of the enclosing lexical scope                |

## 5. Closures

An inner function retains access to its outer function's variables even after
the outer function returns. Uses:

- Encapsulated state (private variables).
- Memoization caches.
- Event handlers that remember their setup context.
- React hooks — every hook is a closure over the component's rendered state.

## 6. Higher-order functions

- Take a function as an argument.
- Return a function.
- Both.

Common: `map`, `filter`, `reduce`, `bind`, `debounce`, `throttle`, `memoize`.

## 7. IIFEs

Historical pattern for scope isolation before modules existed:

```js
(function () {
  const secret = 'x'
})()
```

Modern code uses modules instead — an IIFE is a smell in new code.

## 8. Iterators & generators

- Iterator protocol: `{ next(): { value, done } }`.
- `function*` returns a generator; `yield` pauses.
- Useful for infinite sequences, tree traversal, coroutines.

## Common Bugs

- Losing `this` in a callback: `array.forEach(this.handle)` → the method loses
  its receiver. Fix with `this.handle.bind(this)` or `(item) => this.handle(item)`.
- Memoizing on object args by reference — cache never hits unless the caller
  reuses the exact reference.
- Debouncing per-render in React: `useMemo(() => debounce(fn, 200), [])` is
  a common mistake if `fn` closes over stale state.

## Common Interview Questions

1. Explain `this` — walk through all call forms.
2. What is a closure? Give a real-world use.
3. Difference between `call`, `apply`, `bind`.
4. Implement `debounce` from scratch.
5. Why does `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` print `3 3 3`?
6. Difference between generators and async functions.
