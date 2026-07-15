# Cheatsheet — Functions

## Forms

```js
function decl(x) {} // hoisted, has name
const expr = function (x) {}; // not hoisted, anonymous
const arr = (x) => x * 2; // no own this / arguments / super
const method = { foo(x) {} }.foo; // shorthand
```

## `this` at the call site

```js
obj.fn()          // this = obj
fn()              // this = undefined (strict) / global (sloppy)
new Cls()         // this = new instance
fn.call(x)        // this = x
fn.bind(x)()      // this = x
() => this        // this = enclosing scope (lexical)
```

## Bind / call / apply

```js
fn.call(thisArg, a, b); // invoke with this, spread args
fn.apply(thisArg, [a, b]); // same, args as array
const bound = fn.bind(thisArg, a); // returns a new function with pre-bound args
```

## Closures — private state

```js
function counter() {
  let n = 0;
  return {
    inc: () => ++n,
    read: () => n,
  };
}
```

## Higher-order utilities to know cold

```js
const memoize = (fn) => {
  const cache = new Map();
  return (arg) =>
    cache.has(arg) ? cache.get(arg) : cache.set(arg, fn(arg)).get(arg);
};

const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const throttle = (fn, ms) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
};

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);
```

## Generators

```js
function* range(n) {
  for (let i = 0; i < n; i++) yield i;
}
for (const x of range(3)) console.log(x); // 0 1 2
```

## Interview tips

- If asked to implement `bind`, remember `new`-target semantics (a bound
  function used with `new` ignores the bound `this`).
- Debounce **delays** until quiet; throttle **rate-limits** to one call per interval.
- Memoize with `Map` — supports object keys and never coerces.
