// Module 01 — mini-project — order-processor
//
// Production-style order processor built with fundamentals only.
// Returns { ok: true, data } or { ok: false, errors } — never throws on user input.

const ROLES = new Set(['guest', 'customer', 'staff', 'admin'])

const SPEND_CAP_CENTS = {
  guest: 10_000,        //   $100.00
  customer: 500_000,    // $5,000.00
  staff: Infinity,
  admin: Infinity,
}

const MAX_QUANTITY_PER_LINE = 99
const MAX_TAX_BPS = 10_000            // 100%
const MIN_DISCOUNT_PERCENT = 1
const MAX_DISCOUNT_PERCENT = 100
const BPS_DIVISOR = 10_000

// ---------------------------------------------------------------------------
// Helpers.
// ---------------------------------------------------------------------------

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}

function isValidEmailShape(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  const parts = trimmed.split('@')
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
}

function err(field, message) {
  return { field, message }
}

// ---------------------------------------------------------------------------
// Validation — accumulate ALL errors so the client can fix everything at once.
// ---------------------------------------------------------------------------

function validateCustomer(customer) {
  const errors = []

  if (customer === null || customer === undefined || typeof customer !== 'object') {
    errors.push(err('customer', 'customer is required'))
    return errors
  }

  if (!isNonEmptyString(customer.id)) {
    errors.push(err('customer.id', 'customer id is required'))
  }
  if (!isValidEmailShape(customer.email)) {
    errors.push(err('customer.email', 'invalid email'))
  }
  if (!ROLES.has(customer.role)) {
    errors.push(err('customer.role', `role must be one of ${[...ROLES].join(', ')}`))
  }

  return errors
}

function validateProducts(products) {
  const errors = []

  if (!Array.isArray(products) || products.length === 0) {
    errors.push(err('products', 'at least one product is required'))
    return errors
  }

  for (const [i, product] of products.entries()) {
    const path = `products[${i}]`
    if (product === null || typeof product !== 'object') {
      errors.push(err(path, 'product must be an object'))
      continue
    }
    if (!isNonEmptyString(product.sku)) {
      errors.push(err(`${path}.sku`, 'sku is required'))
    }
    if (!isPositiveInteger(product.priceCents)) {
      errors.push(err(`${path}.priceCents`, 'priceCents must be a positive integer'))
    }
    if (!isPositiveInteger(product.quantity) || product.quantity > MAX_QUANTITY_PER_LINE) {
      errors.push(
        err(`${path}.quantity`, `quantity must be a positive integer ≤ ${MAX_QUANTITY_PER_LINE}`),
      )
    }
  }

  return errors
}

function validateDiscount(discount, role) {
  if (discount === null || discount === undefined) return []

  const errors = []

  if (typeof discount !== 'object') {
    errors.push(err('discount', 'discount must be an object when provided'))
    return errors
  }

  if (!isNonEmptyString(discount.code)) {
    errors.push(err('discount.code', 'discount code is required'))
  }
  if (
    !Number.isInteger(discount.percent)
    || discount.percent < MIN_DISCOUNT_PERCENT
    || discount.percent > MAX_DISCOUNT_PERCENT
  ) {
    errors.push(
      err(
        'discount.percent',
        `discount percent must be an integer between ${MIN_DISCOUNT_PERCENT} and ${MAX_DISCOUNT_PERCENT}`,
      ),
    )
  }

  // Permission — only staff/admin can apply a discount.
  if (role !== 'staff' && role !== 'admin') {
    errors.push(err('discount', 'only staff or admin can apply a discount'))
  }

  return errors
}

function validateTaxRate(taxRateBps) {
  if (taxRateBps === null || taxRateBps === undefined) return []
  if (!isNonNegativeInteger(taxRateBps) || taxRateBps > MAX_TAX_BPS) {
    return [err('taxRateBps', `taxRateBps must be an integer between 0 and ${MAX_TAX_BPS}`)]
  }
  return []
}

// ---------------------------------------------------------------------------
// Computation — all integer cents, no floating-point arithmetic.
// ---------------------------------------------------------------------------

function computeSubtotal(products) {
  return products.reduce(
    (sum, p) => sum + p.priceCents * p.quantity,
    0,
  )
}

function computeItemCount(products) {
  return products.reduce((sum, p) => sum + p.quantity, 0)
}

function computeDiscount(subtotalCents, discount) {
  if (!discount) return 0
  // Multiply first, then integer-divide — avoids float drift.
  return Math.floor((subtotalCents * discount.percent) / 100)
}

function computeTax(taxableCents, taxRateBps) {
  if (!taxRateBps) return 0
  return Math.round((taxableCents * taxRateBps) / BPS_DIVISOR)
}

// ---------------------------------------------------------------------------
// Permission check on final total (post-discount, pre-tax).
// ---------------------------------------------------------------------------

function checkSpendCap(role, amountCents) {
  const cap = SPEND_CAP_CENTS[role]
  if (amountCents <= cap) return []
  return [
    err(
      'total',
      `${role} accounts cannot spend more than ${(cap / 100).toFixed(2)} per order`,
    ),
  ]
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------

const DEFAULT_NOW = () => new Date().toISOString()

/**
 * Process a raw order request from an untrusted source.
 *
 * @param {object} input
 * @param {object} [options]
 * @param {() => string} [options.now]
 * @returns {{ ok: true, data: object } | { ok: false, errors: {field:string, message:string}[] }}
 */
export function processOrder(input, options = {}) {
  const now = typeof options.now === 'function' ? options.now : DEFAULT_NOW

  // Reject non-object payloads up front. Everything below can rely on `input`
  // being an object (though its fields are still untrusted).
  if (input === null || input === undefined || typeof input !== 'object') {
    return {
      ok: false,
      errors: [err('input', 'order payload must be an object')],
    }
  }

  const errors = [
    ...validateCustomer(input.customer),
    ...validateProducts(input.products),
    ...validateDiscount(input.discount, input.customer?.role),
    ...validateTaxRate(input.taxRateBps),
  ]

  if (errors.length) return { ok: false, errors }

  const subtotalCents = computeSubtotal(input.products)
  const discountCents = computeDiscount(subtotalCents, input.discount)
  const taxableCents = subtotalCents - discountCents
  const taxCents = computeTax(taxableCents, input.taxRateBps ?? 0)
  const totalCents = taxableCents + taxCents

  const spendErrors = checkSpendCap(input.customer.role, totalCents)
  if (spendErrors.length) return { ok: false, errors: spendErrors }

  return {
    ok: true,
    data: {
      subtotalCents,
      discountCents,
      taxCents,
      totalCents,
      itemCount: computeItemCount(input.products),
      currency: 'USD',
      receiptedAt: now(),
      customer: {
        id: input.customer.id,
        email: input.customer.email.trim().toLowerCase(),
        role: input.customer.role,
      },
    },
  }
}

// Exports for tests and future extension.
export const _internals = {
  ROLES,
  SPEND_CAP_CENTS,
  isValidEmailShape,
  computeSubtotal,
  computeDiscount,
  computeTax,
}
