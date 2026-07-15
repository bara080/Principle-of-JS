# Cheatsheet — Objects & OOP

## Object literal essentials

```js
const id = 1
const key = 'dynamic'
const user = {
  id,                           // shorthand
  [key]: 'value',               // computed key
  greet() { return 'hi' },      // method
  get name() { return this._n },// accessor
  set name(v) { this._n = v.trim() },
}
```

## Class essentials

```js
class Order {
  #status = 'pending'                 // truly private
  static VERSION = '1.0'              // class-level
  constructor(id) { this.id = id }
  get status() { return this.#status }
  markPaid() { this.#status = 'paid' }
  static empty() { return new Order(crypto.randomUUID()) }
  toJSON() { return { id: this.id, status: this.#status } }
}
```

## Inheritance

```js
class BulkOrder extends Order {
  constructor(id, rate) {
    super(id)                          // must call before `this`
    this.rate = rate
  }
  markPaid() {
    super.markPaid()                   // parent behavior
    this.paidAt = new Date().toISOString()
  }
}
```

## Safe merging

```js
// ❌ prototype pollution risk if `patch` came from JSON.parse
Object.assign(target, patch)

// ✅ whitelist
const allowed = ['name', 'email']
for (const key of allowed) if (key in patch) target[key] = patch[key]

// ✅ Object.create(null) — no prototype at all, no __proto__ hazard
const store = Object.create(null)
```

## Snapshot / freeze / clone

```js
const shallow = { ...user }
const shallowArr = [...items]
const frozen = Object.freeze({ ...user })     // shallow only
const deep = structuredClone(user)            // Node 17+, browsers modern
```

## Common patterns

```js
// Factory function — closure-based privacy, no `this` gotchas
function makeAccount(balance = 0) {
  return {
    deposit(n) { balance += n },
    withdraw(n) { balance -= n },
    read: () => balance,
  }
}

// Registry
const registry = new Map()
registry.set('user', User)
```

## Interview tips

- `class` is sugar over prototypes, but private fields (`#`) are not — they
  cannot be polyfilled with prototypes.
- Composition over inheritance — the "Gang of Four" rule. State it in interviews.
- `Object.create(null)` is safer than `{}` for dictionaries.
