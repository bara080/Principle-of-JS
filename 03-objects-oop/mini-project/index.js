// Module 03 — mini-project — billing domain model
// Stub. Fill in class bodies to satisfy the tests.

export class Customer {
  constructor(_id, _email, _role) {
    throw new Error('TODO: Customer')
  }
}

export class Product {
  constructor(_sku, _name, _priceCents) {
    throw new Error('TODO: Product')
  }
}

export class Invoice {
  constructor(_customer) {
    throw new Error('TODO: Invoice')
  }

  addLine(_product, _qty) {
    throw new Error('TODO: Invoice#addLine')
  }

  applyDiscount(_percent) {
    throw new Error('TODO: Invoice#applyDiscount')
  }

  get totalCents() {
    throw new Error('TODO: Invoice#totalCents')
  }

  toJSON() {
    throw new Error('TODO: Invoice#toJSON')
  }
}
