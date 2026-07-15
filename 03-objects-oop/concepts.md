# Concepts — Objects & OOP

> Status: outline. Full explanations in follow-up pass.

## 1. Object literals

- Shorthand: `{ id, name }` when the key equals the variable name.
- Computed keys: `{ [dynamicKey]: value }`.
- Method shorthand: `{ greet() { ... } }`.

## 2. Prototype chain

Every object has a `[[Prototype]]` (readable via `Object.getPrototypeOf`).
Property lookup walks the chain until it finds the key or hits `null`.

```text
{ id: 1 }
  ↓ __proto__
Object.prototype
  ↓ __proto__
null
```

Class hierarchies are just prototype chains with syntax sugar.

## 3. Classes

```js
class Order {
  #status = 'pending'      // private field
  constructor(id) { this.id = id }
  get status() { return this.#status }
  markPaid() { this.#status = 'paid' }
  static empty() { return new Order(crypto.randomUUID()) }
}
```

- `constructor` runs on `new`.
- `#field` is truly private — not accessible from outside.
- `static` methods belong to the class itself.
- `get` / `set` create accessor properties.

## 4. Inheritance

```js
class BulkOrder extends Order {
  constructor(id, ratePerItem) {
    super(id)
    this.ratePerItem = ratePerItem
  }
}
```

- `super()` must be called before using `this` in the subclass constructor.
- `super.method()` calls the parent's method.

## 5. Composition vs inheritance

Inheritance says *A is a kind of B*. Composition says *A has a B*.

If unsure — compose. `class Order { constructor() { this.customer = new Customer() } }`
scales better than 5 levels of `extends`.

## 6. Object safety

- **Prototype pollution.** Attackers can set `__proto__` on JSON to inject
  properties onto all objects. Never spread untrusted input directly:
  `Object.assign({}, untrusted)` is unsafe if `untrusted` came from JSON.parse
  and contains `__proto__`. Filter with a whitelist.
- **`Object.freeze`** — shallow. Nested objects still mutable.
- **`Object.hasOwn(obj, key)`** — modern replacement for `hasOwnProperty`.

## Common Interview Questions

1. Explain the prototype chain.
2. Difference between `Object.create(null)` and `{}`.
3. What is prototype pollution?
4. When would you use a class vs a plain object factory?
5. Why does `class` exist if it's "just syntax sugar"?
6. Explain private fields — how are they different from `_leadingUnderscore`?
