# Mini-Project — Billing Domain Model

Model a small billing system with proper OOP: `Customer`, `Product`,
`Invoice`. Enforce invariants with private fields, expose a clean public API,
serialize safely to JSON.

## Files

```text
mini-project/
├── README.md
├── index.js         — Customer / Product / Invoice classes
└── index.test.js    — coverage
```

## Requirements

- **`Customer`** — id (readonly), email (validated on set), role (enum).
- **`Product`** — sku, name, priceCents (positive integer).
- **`Invoice`** — belongs to a customer, has line items, `addLine(product, qty)`,
  `applyDiscount(percent)`, `totalCents`, `toJSON()`.
- Invariants must survive attempted external mutation: getters return copies,
  private fields prevent direct access.
- No `class` inheritance for the sake of it — compose where it fits.

Run: `node --test 03-objects-oop/mini-project/index.test.js`.
