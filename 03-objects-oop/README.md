# Module 03 — Objects & OOP

> Model your domain with objects and classes. Understand the prototype chain
> deeply enough that classes stop looking magical.

## Learning Objectives

- Read and reason about the prototype chain without guessing.
- Use `class`, `extends`, `super`, private fields (`#field`) fluently.
- Know when to use classes vs plain object factories vs closures.
- Enforce invariants with getters, setters, and validation methods.
- Model polymorphism with method overriding and composition.
- Guard against prototype pollution.

## Why This Topic Matters

Most application code lives in objects — data models, service classes,
controllers, entities. Get the shape wrong and every feature after depends on
the wrong abstraction. Poor OO design compounds; good models compound faster.

## Where It Is Used In Production

- **Backend models** — `User`, `Order`, `Invoice` domain objects.
- **Service layers** — `PaymentService`, `NotificationService`.
- **React components** — class components (legacy) or hook closures.
- **Error hierarchies** — `class NotFoundError extends AppError`.
- **DTOs and view models** — shaped for consumer expectations.

## Prerequisites

Modules 01–02.

## Skills Gained

- Domain modeling with correct encapsulation.
- Reading unfamiliar `extends`/`super` code without confusion.
- Safe deep-clone, freeze, and immutable-update patterns.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. Deeply-nested `class` hierarchies where composition would be cleaner.
2. Public fields that break invariants — use a setter or `#private`.
3. Forgetting `super()` in a subclass constructor.
4. Using `Object.assign({}, target, source)` on untrusted `source` — prototype
   pollution risk. Use a validated spread.
5. Serializing a class instance with `JSON.stringify` — methods vanish; use a
   dedicated `toJSON`.

## Best Practices

- Prefer composition over inheritance. Reach for `extends` only when the
  subclass truly *is a* superclass, without qualification.
- Use `#privateField` for anything that isn't part of the public contract.
- Static methods for factories: `class User { static fromRow(row) { … } }`.
- Freeze value objects: `Object.freeze` after construction.

## Mini-Project Overview

**`mini-project/`** — a domain model for a small billing system: `Customer`,
`Product`, `Invoice` classes with `addLine`, `applyDiscount`, `total()`,
`toJSON()`. Prototype-pollution-resistant. Fully tested.

## Recommended Resources

- MDN — Classes: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes>
- MDN — Inheritance and the prototype chain
- *You Don't Know JS Yet — this & Object Prototypes*
